export function WelcomeHeader() {
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="flex flex-col gap-4">
      <p className="text-sm font-medium uppercase tracking-[0.22em] text-rose-800 dark:text-rose-300">
        Welcome
      </p>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">
        Today&apos;s Top 10 news
      </h1>
      <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        A brief hello and the day&apos;s leading headlines, gathered for
        you from a public news feed.
      </p>
      <p className="text-sm text-zinc-500 dark:text-zinc-500">{today}</p>
    </header>
  );
}
