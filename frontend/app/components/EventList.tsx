import { EventCard } from "./EventCard";
import type { MessageItem } from "@/types/message";

interface EventListProps {
  messages: MessageItem[];
}

export const EventList = ({ messages }: EventListProps) => {
  if (!messages.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
        No messages yet. Send something to our Telegram bot to see it here.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {messages.map((message) => (
        <EventCard key={message._id} message={message} />
      ))}
    </div>
  );
};
