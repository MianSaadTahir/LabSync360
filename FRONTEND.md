# LabSync AI Frontend

A minimal Next.js 14 (App Router) UI that surfaces Telegram messages (and can be extended to show structured events).

## Stack
- Next.js 14 (App Router, server components)
- TypeScript
- Tailwind CSS via `@tailwindcss/postcss`

## Structure
```
frontend/
├─ app/
│  ├─ layout.tsx     # Global shell + nav
│  ├─ page.tsx       # Landing hero
│  ├─ events/page.tsx
│  └─ components/
│     ├─ EventCard.tsx
│     └─ EventList.tsx
├─ types/event.ts    # Event typings (unused once message-only flow is active)
├─ types/message.ts  # Telegram message typings
├─ tailwind.config.ts
└─ app/globals.css   # Tailwind + design tokens
```

## Environment
Create `frontend/.env.local` (or reuse root `.env.example` values):
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

## Running
```bash
cd frontend
npm install
npm run dev
# open http://localhost:3000
```

`/events` uses a server-side fetch to `NEXT_PUBLIC_API_BASE_URL + /api/messages`, so ensure the backend is running first.

## Components
- **EventCard** — now renders a raw Telegram message (text, sender, timestamp, tag).
- **EventList** — grid wrapper that renders message cards and shows an empty state until the first webhook arrives.

## Styling
Tailwind powers the layout. Base colors/fonts live in `app/globals.css` so the UI matches the product brief (clean, minimal, blue accent).

## Extending
- Re-enable event view by swapping the fetch back to `/api/events` and using `EventItem` typing.
- For pagination/filters, extend `app/events/page.tsx` to pass query params to the backend.
- Introduce client components or SWR if you need live updates or auto-refreshing messages.
- Add quick-tag actions that call `PATCH /api/messages/:id/tag` for better triage.
