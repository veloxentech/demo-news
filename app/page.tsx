import { NewsList } from "@/components/NewsList";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { getTopNews } from "@/lib/news";

export const revalidate = 900;

export default async function Home() {
  const items = await getTopNews();

  return (
    <div className="flex flex-1 flex-col bg-[var(--background)]">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16 sm:px-8 sm:py-20">
        <WelcomeHeader />
        <NewsList items={items} />
      </main>
    </div>
  );
}
