# LabSync AI Backend

Node.js + Express service that ingests Telegram webhook updates, stores raw messages in MongoDB, performs simple rule-based event extraction, and exposes CRUD APIs for downstream consumption.

## Stack & Structure
- **Runtime:** Node.js 18+
- **Framework:** Express 4
- **Database:** MongoDB via Mongoose
- **Other libs:** express-validator, cors, morgan, uuid

```
backend/
├─ app.js                # Express app wiring
├─ server.js             # Bootstraps DB + HTTP server
├─ src/
│  ├─ config/db.js       # Mongo connection helper
│  ├─ controllers/       # Webhook, message, extraction, event logic
│  ├─ middleware/        # Error handler
│  ├─ models/            # Message, ExtractedEvent, Event schemas
│  ├─ routes/            # API route modules
│  └─ utils/             # Response helpers + rule-based extractor
├─ scripts/seedMockData.js
└─ package.json
```

## Environment
Create `backend/.env` from `.env.example` with:
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/labsync_ai
TELEGRAM_BOT_TOKEN=...      # only needed when registering webhook
TELEGRAM_WEBHOOK_URL=https://your-domain.com/api/webhook/telegram
```

## Running Locally
```bash
cd backend
npm install
npm run dev      # nodemon
# or npm start   # plain node
```

## Database
Collections:
- `messages`: raw Telegram messages + manual tags
- `extractedevents`: outputs from rule-based parser
- `events`: curated event objects served to frontend

Seed with representative data:
```bash
npm run seed
```

## API Reference (all responses JSON)
Base URL: `http://localhost:4000/api`

| Method & Path | Description |
| --- | --- |
| `POST /webhook/telegram` | Telegram webhook receiver (stores messages). |
| `GET /messages` | List all ingested messages. |
| `PATCH /messages/:id/tag` | Update tag (`meeting|reminder|task|none`). `id` = Mongo `_id`. |
| `POST /extract/:message_id` | Run rule-based extraction for a message. Accepts Mongo `_id` **or** original `message_id`. |
| `POST /events/create` | Body `{ "extractedEventId": "..." }`. Creates Event from extracted record. |
| `GET /events` | List events. Optional filters `?date=YYYY-MM-DD` and `?type=meeting`. |
| `GET /events/:id` | Fetch single event by Mongo `_id`. |
| `PATCH /events/:id` | Update event fields (title, date, time, type, etc.). |
| `DELETE /events/:id` | Remove an event. |

### Error Format
```
{
  "success": false,
  "message": "Reason"
}
```

### Rule-Based Extraction
Located in `src/utils/extractor.js`:
- Detects keywords (`meeting`, `call`, `discussion`).
- Parses date tokens (`today`, `tomorrow`, weekdays).
- Parses time strings (12/24h).
- Confidence is `medium` when both date & time present, otherwise `low`.

### Telegram Webhook
1. Expose `/api/webhook/telegram` publicly (via tunnel or deploy).
2. Register with Telegram: `https://api.telegram.org/bot<token>/setWebhook?url=<TELEGRAM_WEBHOOK_URL>`.
3. Incoming updates are upserted into `messages` collection.

### Testing the Flow
1. Send a Telegram message to the bot (e.g., "Team meeting tomorrow at 3pm").
2. `GET /api/messages` to confirm storage.
3. `PATCH /api/messages/:id/tag` to classify.
4. `POST /api/extract/:messageId` to generate an extracted event.
5. `POST /api/events/create` with the extracted event id.
6. `GET /api/events` to see data consumed by the frontend.
