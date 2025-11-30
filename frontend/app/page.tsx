import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-4xl flex-col justify-center gap-6 px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
        LabSync AI
      </p>
      <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
        Telegram-first event intelligence
      </h1>
      <p className="text-lg text-slate-600 sm:max-w-2xl">
        Capture Telegram updates, tag them, extract key dates, and browse a clean
        list of structured events. Start by opening the event viewer to see what
        LabSync AI already knows.
      </p>
      <div className="flex flex-wrap gap-4">
        <Link
          href="/events"
          className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-500"
        >
          Open Event Viewer
        </Link>
        <a
          href="https://core.telegram.org/bots/webhooks"
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
        >
          Configure webhook
        </a>
      </div>
    </main>
  );
}
