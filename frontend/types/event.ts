export type EventType = 'meeting' | 'reminder' | 'task' | 'none';
export type ConfidenceLevel = 'low' | 'medium';

export interface EventItem {
  _id?: string;
  event_id?: string;
  title: string;
  date?: string;
  time?: string;
  type?: EventType;
  source_message_id?: string;
  source_text?: string;
  confidence?: ConfidenceLevel;
  created_at?: string;
}
