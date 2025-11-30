import { EventList } from "../components/EventList";
import type { EventItem } from "@/types/event";

const fetchEvents = async (): Promise<EventItem[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  try {
    const res = await fetch(`${baseUrl}/api/events`, { next: { revalidate: 0 } });
    if (!res.ok) {
      console.error('Failed to load events', await res.text());
      return [];
    }
    const payload = await res.json();
    return payload.data ?? [];
  } catch (error) {
    console.error('Events fetch error', error);
    return [];
  }
};

export default async function EventsPage() {
  const events = await fetchEvents();

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-5xl flex-col gap-10 px-4 py-12">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
          Event Viewer
        </p>
        <h1 className="text-3xl font-bold text-slate-900">Structured events</h1>
        <p className="text-slate-500">
          Messages tagged as meetings, reminders, or tasks will appear here once
          they are extracted into events.
        </p>
      </header>
      <EventList events={events} />
    </main>
  );
}
