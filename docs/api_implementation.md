# Tradexa API & Backend Implementation

This outlines the database schema and API structure, vital for rewriting the backend logic in another environment (like Dart/Firebase/Supabase for a Flutter app).

## 1. Database Schema Representation (Prisma to TS/JSON)

```typescript
model Trade {
  id         String   // Unique identifier (UUID/CUID)
  userId     String   // Foreign key to User
  
  pair       String   // e.g., "EUR/USD"
  date       DateTime // Stored in UTC, read locally
  session    String   // "London", "New York", "Asian", "Frankfurt"
  entryTF    String   // "1m", "5m", "15m", "1H", "4H", "D"
  direction  String   // "LONG" | "SHORT"
  pnl        Float    // Profit/Loss value (e.g., -150.50)
  rr         Float    // Risk/Reward multiple (e.g., 2.5)
  day        String   // "Monday", "Tuesday", etc.
  emotion    String   // Free text or strict enum ("Fear", "Greed", "Neutral")
  notes      String?  // Optional text area
  
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

## 2. API Endpoints

All endpoints require an authenticated user session. The `userId` is extracted from the secure session token, never from the client payload.

### `POST /api/trades`
- **Purpose**: Create a new trade.
- **Body**: `{ pair, date, session, entryTF, direction, pnl, rr, day, emotion, notes }`
- **Response**: `200 OK` with the created trade object.

### `PUT /api/trades`
- **Purpose**: Update an existing trade.
- **Body**: Same as POST, but must include `id`.
- **Backend Logic**: Validates that the trade belongs to the requesting `userId` before updating.

### `GET /api/trades/[id]`
- **Purpose**: Fetch a single trade for the Edit form.
- **Response**: Pre-populated trade object. Returns `404` or `401` if not found or unauthorized.

### `DELETE /api/trades/[id]`
- **Purpose**: Delete a trade by its ID.
- **Auth**: Session required. The backend verifies the trade belongs to the authenticated user before deleting.
- **Response**: `200 OK` with `{ success: true }`. Returns `404` if the trade is not found or doesn't belong to the user.
- **Frontend Behavior**: The row is optimistically removed from the local state with an animated exit (fade + scale down). No page refresh needed.


### Summary Analytics & Overview
In Next.js, the Overview page fetches directly from the Database via Server Components (Service Layer). For a REST architecture, you would implement:

#### `GET /api/trades` (or Overview service)
- **Response**: An array of `Trade[]` mapped specifically for the `TradeTable` component, and top-level aggregates (Total PnL, Win Rate).

#### `GET /api/trades/summary`
- **Purpose**: Provides pre-calculated data for charts to avoid heavy client-side processing.
- **Calculations required by Backend:**
  - **PnL Curve**: Sort trades chronologically. Loop through and keep a rolling sum of `pnl`. Map to `{ day: "MM/DD", pnl: rollingSum }`.
  - **RR by Session**: Group trades by `session`. Calculate the mean `rr` for each group. Map to `{ name: "[Session]", avgRR: [mean] }`.
  - **Psychology**: Tally the occurrence of each `emotion` string. Return the highest one via percentage. Tally the lowest average RR by session and return it as "Worst Session".
