import type { NewsItem as NewsItemType } from "@/lib/news";

type NewsItemProps = {
  item: NewsItemType;
  rank: number;
};

export function NewsItem({ item, rank }: NewsItemProps) {
  const publishedLabel = formatPublishedAt(item.publishedAt);

  return (
    <li className="group border-t border-zinc-200 py-5 first:border-t-0 first:pt-0 dark:border-zinc-800">
      <article className="flex gap-4 sm:gap-6">
        <span
          aria-hidden="true"
          className="mt-1 w-8 shrink-0 text-sm font-semibold tabular-nums text-rose-800 dark:text-rose-300"
        >
          {String(rank).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-medium leading-7 text-zinc-950 dark:text-zinc-50">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 transition-colors hover:text-rose-800 hover:underline dark:hover:text-rose-300"
            >
              {item.title}
            </a>
          </h2>
          {(item.source || publishedLabel) && (
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
              {item.source ? <span>{item.source}</span> : null}
              {item.source && publishedLabel ? (
                <span aria-hidden="true">·</span>
              ) : null}
              {publishedLabel && item.publishedAt ? (
                <time dateTime={item.publishedAt}>{publishedLabel}</time>
              ) : null}
            </p>
          )}
        </div>
      </article>
    </li>
  );
}

function formatPublishedAt(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
