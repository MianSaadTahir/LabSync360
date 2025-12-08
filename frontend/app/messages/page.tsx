import { MessageList } from "../components/MessageList";
import type { MessageItem } from "@/types/message";

const fetchMessages = async (): Promise<MessageItem[]> => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const res = await fetch(`${baseUrl}/api/messages`, {
      next: { revalidate: 0 },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to load messages:", res.status, errorText);
      return [];
    }
    const payload = await res.json();
    return payload.data ?? [];
  } catch (error) {
    // Only log if it's not an abort/timeout (which we handle gracefully)
    if (error instanceof Error && error.name !== 'AbortError') {
      console.error("Messages fetch error:", error.message);
    }
    return [];
  }
};

export default async function MessagesPage() {
  const messages = await fetchMessages();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-5xl flex-col gap-10 px-4 py-12">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
          Inbox
        </p>
        <h1 className="text-3xl font-bold text-slate-900">Telegram Messages</h1>
        <p className="text-slate-500">
          All messages received from Telegram are displayed here in real-time.
        </p>
      </header>
      {messages.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">
            No messages found. Make sure the backend server is running on {baseUrl}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Start the backend with: <code className="rounded bg-slate-100 px-2 py-1">cd backend && npm run dev</code>
          </p>
        </div>
      ) : (
        <MessageList messages={messages} />
      )}
    </main>
  );
}
