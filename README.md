# demo-news

Welcome with Today's Top 10 news ([SCRUM-18](https://github.com/veloxentech/demo-news)).

A Next.js (App Router) + TypeScript + Tailwind CSS landing page that greets visitors and lists up to 10 current headlines (title, link, and source/time when available). There is no authentication, personalization, or admin CMS.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build
npm start
npm run lint
```

## Environment variables

Copy `.env.example` to `.env.local` if you want to override the default feed:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
| --- | --- | --- |
| `NEWS_FEED_URL` | No | Public RSS or Atom feed URL. Defaults to BBC News top stories (`https://feeds.bbci.co.uk/news/rss.xml`). No API key is required. |

Do not commit secrets. This app does not need an API key for the default feed.

## News source

Headlines are fetched **server-side** from a public RSS/Atom feed, normalized to `{ title, url, source?, publishedAt? }`, and capped at 10 items. If the feed cannot be loaded, the page shows a clear empty/error state instead of fake stories.

The list is revalidated about every 15 minutes.

## Deploy on Vercel

This project is a standard Next.js app and can be deployed on Vercel as-is. If you set `NEWS_FEED_URL`, add it in the Vercel project environment variables.
