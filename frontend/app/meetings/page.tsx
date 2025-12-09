import { MeetingList } from "../components/MeetingList";
import type { MeetingItem } from "@/types/meeting";

const fetchMeetings = async (): Promise<MeetingItem[]> => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  try {
    const res = await fetch(`${baseUrl}/api/meetings`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      console.error("Failed to load meetings", await res.text());
      return [];
    }
    const payload = await res.json();
    return payload.data ?? [];
  } catch (error) {
    console.error("Meetings fetch error", error);
    return [];
  }
};

export default async function MeetingsPage() {
  const meetings = await fetchMeetings();

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-5xl flex-col gap-10 px-4 py-12">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
          Module 1
        </p>
        <h1 className="text-3xl font-bold text-slate-900">Meetings</h1>
        <p className="text-slate-500">
          Extracted meeting details from Telegram messages.
        </p>
      </header>
      <MeetingList meetings={meetings} />
    </main>
  );
}



