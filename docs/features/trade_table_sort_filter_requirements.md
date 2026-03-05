# Requirement: Sort & Filter -- Trade History Table

## 1. Objective

Enhance the **Trade History table** on the Dashboard Overview page to
support:

-   Column sorting
-   Multi-criteria filtering
-   Clear filter state
-   Fast client-side interaction

The goal is to help users quickly analyze their trading activity.

------------------------------------------------------------------------

# 2. Table Context

The table displays `recentTrades` with the following schema:

  Column       Field       Type
  ------------ ----------- --------------------
  Date / Day   date, day   Date, String
  Pair         pair        String
  Session      session     Enum/String
  TF           entryTF     String
  Direction    direction   Enum (LONG, SHORT)
  RR           rr          Number
  Mindset      emotion     String
  PnL          pnl         Number

------------------------------------------------------------------------

# 3. Sorting Requirements

## Supported Sort Columns

  Column      Sort Type
  ----------- ----------------------------
  Date        chronological
  Pair        alphabetical
  Session     alphabetical
  TF          predefined timeframe order
  Direction   LONG / SHORT
  RR          numeric
  PnL         numeric

### Default Sort

Date DESC (newest first)

### Sort Interaction

Clicking a column header cycles through:

ASC → DESC → NONE

### Visual Indicator

Columns should show indicators: - ▲ Ascending - ▼ Descending

### Sorting Scope

Only **single-column sorting** is required.

------------------------------------------------------------------------

# 4. Filtering Requirements

Filtering must allow **multiple filters simultaneously**.

Example:

Pair = BTCUSD\
Session = London\
Direction = LONG

All filters use **AND logic**.

------------------------------------------------------------------------

# 5. Filter Fields

## Pair Filter

Type: Multi-select dropdown

Values dynamically derived from trades.

Example: - BTCUSD - EURUSD - XAUUSD - NAS100

------------------------------------------------------------------------

## Session Filter

Type: Multi-select dropdown

Values: - Asia - London - New York

------------------------------------------------------------------------

## Timeframe Filter

Field: `entryTF`

Type: Multi-select

Example: - M5 - M15 - H1 - H4 - D1

------------------------------------------------------------------------

## Direction Filter

Type: Toggle

Options: - LONG - SHORT - Both

------------------------------------------------------------------------

## RR Range Filter

Type: - Range slider OR - Min / Max numeric input

Example:

Min RR: \_\_\_\
Max RR: \_\_\_

------------------------------------------------------------------------

## PnL Filter

Type: Dropdown

Options: - All - Winning Trades - Losing Trades - Breakeven

Rules: - Winning → pnl \> 0 - Losing → pnl \< 0 - Breakeven → pnl = 0

------------------------------------------------------------------------

## Date Range Filter

Type: Date range picker

Fields: From: \[date\]\
To: \[date\]

------------------------------------------------------------------------

# 6. Filter UI Layout

Filters must appear **above the table**.

Example layout:

\[Pair\] \[Session\] \[TF\] \[Direction\] \[RR Range\] \[PnL\] \[Date
Range\] \[Reset Filters\]

------------------------------------------------------------------------

# 7. Reset Filters

A **Reset Filters** button must:

-   Clear all filters
-   Restore default sorting (Date DESC)
-   Show all rows

------------------------------------------------------------------------

# 8. Data Processing Flow

Filtering and sorting operate on:

`recentTrades`

Processing order:

recentTrades\
→ applyFilters()\
→ applySorting()\
→ render table rows

------------------------------------------------------------------------

# 9. Performance Scope

Expected dataset size:

20--100 rows

Therefore: Client-side filtering and sorting is acceptable.

------------------------------------------------------------------------

# 10. Empty State

If no results match filters:

Display message:

"No trades match the selected filters."

Include button:

Reset Filters

------------------------------------------------------------------------

# 11. Mobile Behavior

Filters collapse into a button:

\[Filter ⚙\]

Opening reveals filters inside a modal or drawer.

------------------------------------------------------------------------

# 12. State Management

Filter and sorting state must persist during re-renders.

Recommended: - React useState OR - URL query params

Example:

/dashboard?pair=BTCUSD&direction=LONG

------------------------------------------------------------------------

# 13. Accessibility

Ensure:

-   Keyboard accessible dropdowns
-   ARIA labels
-   Visible focus states

------------------------------------------------------------------------

# 14. Out of Scope

Not included:

-   Server-side filtering
-   Pagination
-   Export CSV
-   Saved filter presets
-   Multi-column sorting

------------------------------------------------------------------------

# 15. Acceptance Criteria

Implementation is complete when:

-   Table columns can be sorted
-   Multiple filters work simultaneously
-   Reset restores default state
-   Default sort = Date DESC
-   No page reload occurs
-   Interaction latency \< 100ms
