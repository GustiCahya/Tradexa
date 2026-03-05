# Tradexa Features Overview

This document describes the core features and user flows of the Tradexa application.

## 1. Authentication
- User sign-up (Email/Password) and login.
- JWT-based session management.
- Unauthenticated users are redirected to `/login` if attempting to access protected routes (`/overview`, `/trade-input`, `/summary`).

## 2. Dashboard (Overview)
The central hub for viewing trade history.
- **Summary Cards:** Top-level stats calculated from all trades.
  - Total PnL (sum of all PnL, blue if positive, orange if negative).
  - Win Rate (% of trades where PnL > 0).
  - Total Trades (Count).
  - Average RR (Mean of all RR).
- **Interactive Trade Table:**
  - **Sorting:** Clickable column headers (Date, Pair, Session, TF, Dir, RR, Mindset, PnL) to sort Ascending/Descending. Rows animate smoothly on reorder via `framer-motion` layout animations.
  - **Filtering:** A modal exposing multi-criteria filters:
    - Arrays (Checkboxes): Pairs, Sessions, Timeframes.
    - Dropdowns: Direction (Long/Short), PnL State (Winning/Losing/Breakeven).
    - Ranges: Date (From/To), RR (Min/Max).
  - **Pagination:** Chunks the data locally (Client-side) into 100 rows per page.
  - **Clickable Rows:** Clicking a row routes the user to the Edit page (`/trade-input?id=...`).
  - **Delete via Context Menu:** Right-clicking (desktop) or long-pressing (mobile, 600ms hold) on a row shows an animated floating context menu. Clicking "Delete Trade" calls `DELETE /api/trades/[id]` and optimistically removes the row from the local state with an animated exit.

## 3. Log Trade (Form)
Handles both Creation and Editing of trade records.
- **Edit Mode:** If an `id` query parameter is present, the page fetches the trade data and pre-fills the form. The UI changes the title to "Edit Trade" and button to "Update".
- **Pair Autocomplete:** `datalist` providing common CFD pairs (EUR/USD, GBP/JPY, BTC/USD).
- **Date & Time Sync:** 
  - Standard HTML `datetime-local` input formatted to the user's local timezone.
  - White calendar icon enforced via `color-scheme: dark`.
  - The "Day" dropdown is visually disabled and programmatically synced to whatever Date is selected in the Date picker.
- **PnL & Risk/Reward Sync logic:**
  - If a user types a negative sign `-` into the PnL input, the RR input automatically prepends a `-` (and vice-versa).
  - Both fields strip signs if the other is cleared of a negative state.

## 4. Analytics (Summary View)
Visual data representation using Recharts.
- **Cumulative PnL Curve:** A Line chart mapping `date` (X-axis) against a rolling sum of `pnl` (Y-axis).
- **Average RR by Session:** A Bar chart mapping the Mean RR grouping by `session` (London, New York, Asian, Frankfurt). Bars are colored Blue if RR > 2, else Slate/Muted.
- **Psychological Insights:**
  - Most Frequent Emotion (Count of highest occurring `emotion` string).
  - Worst Session by RR.
