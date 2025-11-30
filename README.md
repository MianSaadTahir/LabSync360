# LabSync AI — Release 1 & 2

Minimal end-to-end system that ingests Telegram bot messages, lets operators tag them, performs rule-based event extraction, and surfaces finished events in a Next.js viewer.

## Features (Sprint 1-6)

- Telegram webhook intake (`/api/webhook/telegram`) stores every raw message
- Manual message tagging via REST (`GET /messages`, `PATCH /messages/:id/tag`)
- Rule-based extraction for dates/times/keywords (`POST /extract/:message_id`)
- Event structuring and CRUD API (`/api/events` suite + `/events/create`)
- Next.js Event Viewer at `http://localhost:3000/events`
- Mock data seeding, Postman collection, and full documentation (see `BACKEND.md`, `FRONTEND.md`)

## Project Layout

```
/labsyncAI
├─ backend/        # Express + Mongo service
├─ frontend/       # Next.js 14 UI (App Router)
├─ BACKEND.md      # Backend deep-dive
├─ FRONTEND.md     # Frontend notes
├─ README.md       # You are here
├─ .env.example    # Shared env template
└─ LabSync.postman_collection.json
```

## Prerequisites

- Node.js 18+
- MongoDB 6+
- Telegram Bot token (via BotFather) for real webhook tests

## Getting Started

### 1. Configure Environment

```
cp .env.example backend/.env
cp .env.example frontend/.env.local   # keep only NEXT_PUBLIC_API_BASE_URL entry
```

Update connection string + tokens as needed.

### 2. Backend

```bash
cd backend
npm install
npm run dev            # starts on http://localhost:4000
npm run seed           # optional: loads mock data
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev            # http://localhost:3000
```

Visit `/events` to see synced events.

## Telegram Webhook Setup (Simple Steps)

**You need:** Your bot token from BotFather

### Step 1: Make your backend accessible from internet

Install ngrok (if you don't have it):

```bash
# macOS
brew install ngrok

# Or download from https://ngrok.com/download
```

Start ngrok to expose your backend:

```bash
ngrok http 4000
```

You'll see something like:

```
Forwarding  https://abc123.ngrok.io -> http://localhost:4000
```

**Copy that HTTPS URL** (e.g., `https://abc123.ngrok.io`)

### Step 2: Register webhook with Telegram

Open your browser and go to this URL (replace `YOUR_BOT_TOKEN` and `YOUR_NGROK_URL`):

```
https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook?url=YOUR_NGROK_URL/api/webhook/telegram
```

**Example:**

```
https://api.telegram.org/bot123456789:ABCdefGHIjklMNOpqrsTUVwxyz/setWebhook?url=https://abc123.ngrok.io/api/webhook/telegram
```

You should see: `{"ok":true,"result":true,"description":"Webhook was set"}`

### Step 3: Test it!

1. Make sure your backend is running (`npm run dev` in backend folder)
2. Make sure ngrok is still running
3. Send a message to your Telegram bot
4. Check your backend logs - you should see the message received!
5. Visit `http://localhost:4000/api/messages` to see stored messages

**Done!** Now every message sent to your bot will be saved automatically.

## Postman Collection

Import `LabSync.postman_collection.json` for ready-made calls covering:

- Telegram webhook sample request
- Message list + tag update
- Extraction + Event creation flow
- Event CRUD + filters

## Testing Flow

1. Send a Telegram message (or POST to the webhook manually).
2. `GET /api/messages`
3. Tag it with `PATCH /api/messages/:id/tag`.
4. Run `POST /api/extract/:message_id` to create an extracted event.
5. `POST /api/events/create` with the extracted id.
6. Check `GET /api/events` and refresh the `/events` UI.

## Mock Data

Run `npm run seed` inside `backend` to populate sample messages, extracted events, and events.

## Next Steps

- Integrate authentication + role-based access
- Replace rule-based extractor with LLM-powered pipeline
- Sync events to external calendars (Google/Microsoft)
