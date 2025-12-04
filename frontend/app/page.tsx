import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-4xl flex-col justify-center gap-6 px-6 py-20">
      <p className="text-base font-semibold uppercase tracking-widest text-blue-500">
        LabSync AI
      </p>
      <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
        Smart Client Intake via Telegram
      </h1>
      <p className="text-lg text-slate-600 sm:max-w-2xl">
        Seamlessly capture client project requests sent through Telegram and
        display them on dashboard for your internal teams to process and
        allocate resources.
      </p>
      <div className="flex flex-wrap gap-4">
        <Link
          href="/events"
          className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-500"
        >
          Inbox
        </Link>
      </div>
    </main>
  );
}
