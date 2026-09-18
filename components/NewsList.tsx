import { NewsItem } from "@/components/NewsItem";
import type { NewsItem as NewsItemType } from "@/lib/news";

type NewsListProps = {
  items: NewsItemType[];
};

export function NewsList({ items }: NewsListProps) {
  if (items.length === 0) {
    return (
      <p
        role="status"
        className="rounded-2xl border border-dashed border-zinc-300 bg-white/70 px-5 py-8 text-base leading-7 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400"
      >
        Today&apos;s news could not be loaded right now. Please try again
        later.
      </p>
    );
  }

  return (
    <ol className="rounded-2xl border border-zinc-200 bg-white px-5 py-2 shadow-sm sm:px-8 dark:border-zinc-800 dark:bg-zinc-950">
      {items.map((item, index) => (
        <NewsItem key={`${item.url}-${index}`} item={item} rank={index + 1} />
      ))}
    </ol>
  );
}
