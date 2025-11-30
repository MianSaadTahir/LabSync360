import { EventCard } from "./EventCard";
import type { EventItem } from "@/types/event";

interface EventListProps {
  events: EventItem[];
}

export const EventList = ({ events }: EventListProps) => {
  if (!events.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
        No events yet. Trigger an extraction to see items here.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {events.map((event) => (
        <EventCard key={event._id ?? event.event_id ?? event.title} event={event} />
      ))}
    </div>
  );
};
