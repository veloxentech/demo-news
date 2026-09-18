export type NewsItem = {
  title: string;
  url: string;
  source?: string;
  publishedAt?: string;
};

const DEFAULT_FEED_URL = "https://feeds.bbci.co.uk/news/rss.xml";
const MAX_ITEMS = 10;
const REVALIDATE_SECONDS = 900;

export async function getTopNews(): Promise<NewsItem[]> {
  const feedUrl = process.env.NEWS_FEED_URL?.trim() || DEFAULT_FEED_URL;

  try {
    const response = await fetch(feedUrl, {
      headers: {
        Accept:
          "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
        "User-Agent":
          "demo-news/1.0 (+https://github.com/veloxentech/demo-news)",
      },
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      console.error(
        `News feed request failed (${response.status} ${response.statusText})`,
      );
      return [];
    }

    const xml = await response.text();
    return normalizeFeed(xml).slice(0, MAX_ITEMS);
  } catch (error) {
    console.error("Failed to load news feed:", error);
    return [];
  }
}

function normalizeFeed(xml: string): NewsItem[] {
  const channelTitle = firstTagContent(xml, "title");
  const rssItems = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];
  const atomEntries = xml.match(/<entry\b[\s\S]*?<\/entry>/gi) ?? [];
  const blocks = rssItems.length > 0 ? rssItems : atomEntries;

  const seen = new Set<string>();
  const items: NewsItem[] = [];

  for (const block of blocks) {
    const title = firstTagContent(block, "title");
    const url =
      firstTagContent(block, "link") ||
      attributeValue(block, "link", "href") ||
      firstTagContent(block, "id") ||
      firstTagContent(block, "guid");

    if (!title || !url || !isHttpUrl(url) || seen.has(url)) {
      continue;
    }

    seen.add(url);

    const source =
      firstTagContent(block, "source") ||
      attributeValue(block, "source", "url") ||
      channelTitle ||
      undefined;
    const publishedRaw =
      firstTagContent(block, "pubDate") ||
      firstTagContent(block, "published") ||
      firstTagContent(block, "updated") ||
      firstTagContent(block, "dc:date");

    items.push({
      title,
      url,
      source,
      publishedAt: toIsoDate(publishedRaw),
    });
  }

  return items;
}

function firstTagContent(xml: string, tag: string): string | undefined {
  const match = xml.match(
    new RegExp(`<${escapeRegExp(tag)}(?:\\s[^>]*)?>([\\s\\S]*?)</${escapeRegExp(tag)}>`, "i"),
  );
  if (!match) {
    return undefined;
  }
  const value = decodeXml(match[1]);
  return value || undefined;
}

function attributeValue(
  xml: string,
  tag: string,
  attribute: string,
): string | undefined {
  const match = xml.match(
    new RegExp(
      `<${escapeRegExp(tag)}\\b[^>]*\\b${escapeRegExp(attribute)}="([^"]+)"[^>]*/?>`,
      "i",
    ),
  );
  if (!match) {
    return undefined;
  }
  const value = decodeXml(match[1]);
  return value || undefined;
}

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)))
    .replace(/\s+/g, " ")
    .trim();
}

function toIsoDate(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return date.toISOString();
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
