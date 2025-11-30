import type { EventItem } from "@/types/event";

const formatDisplay = (date?: string, time?: string) => {
  if (!date && !time) return "No schedule provided";

  const dateLabel = date
    ? new Date(date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Date TBD";

  if (!time) {
    return dateLabel;
  }

  const [hours = "00", minutes = "00"] = time.split(":");
  const dateObj = new Date(date || new Date().toISOString().split("T")[0]);
  dateObj.setHours(Number(hours), Number(minutes));

  const timeLabel = dateObj.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${dateLabel} · ${timeLabel}`;
};

interface EventCardProps {
  event: EventItem;
}

export const EventCard = ({ event }: EventCardProps) => {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-slate-900">{event.title}</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
          {event.type ?? "none"}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-500">{event.source_text ?? "No message preview"}</p>
      <p className="mt-4 text-sm font-medium text-slate-700">
        {formatDisplay(event.date, event.time)}
      </p>
      <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">
        Confidence: {event.confidence ?? "n/a"}
      </p>
    </article>
  );
};
