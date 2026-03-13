# Trade Input Form & Update Flow Documentation

## 1. Request Details: Trade Input Form Fields ([app/trade-input/page.tsx](file:///d:/projects/tradexa/app/trade-input/page.tsx))

The Trade Input page consists of a comprehensive form representing a trade record. Here is the detailed breakdown of each input, its behavior, and predefined datasets (datalists/select options):

### Identifying Information
- **Pair / Symbol (`pair`)**
  - **Type**: Text Input (`string`) with `<datalist>`.
  - **Validation**: Required.
  - **Datalist Options**: `EUR/USD`, `GBP/USD`, `USD/JPY`, `AUD/USD`, `USD/CAD`, `USD/CHF`, `NZD/USD`, `GBP/JPY`, `XAU/USD`, `BTC/USD`, `ETH/USD`.

- **Date & Time (`date`)**
  - **Type**: Datetime Local Input (`datetime-local`).
  - **Validation**: Required.
  - **Behavior**: Modifying this input automatically triggers logic to determine the weekday and populates the `Day` field.

- **Day (`day`)**
  - **Type**: Select Dropdown (`string`).
  - **State**: Disabled (Auto-populated).
  - **Options**: `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday`.

### Trade Execution Details
- **Session ([session](file:///d:/projects/tradexa/auth.ts#44-50))**
  - **Type**: Select Dropdown (`string`).
  - **Options**: `London`, `New York`, `Asian`, `Overlap`.
  - **Default**: `London`.

- **Entry TF (Timeframe) (`entryTF`)**
  - **Type**: Text Input (`string`).
  - **Placeholder**: `e.g. 1m, 5m`.

- **Direction (`direction`)**
  - **Type**: Select Dropdown (`string`).
  - **Options**: `LONG`, `SHORT`.

### Performance & Psychology
- **Profit / Loss ($) (`pnl`)**
  - **Type**: Number Input (`step="any"`).
  - **Behavior**: Employs a specific [syncSigns](file:///d:/projects/tradexa/app/trade-input/page.tsx#107-125) logic. If a user types a negative sign (`-`), it automatically enforces the negative sign on the `rr` (Risk-Reward) field, ensuring PNL and RR correlate directionally.

- **Risk-Reward (RR) (`rr`)**
  - **Type**: Number Input (`step="0.1"`).
  - **Behavior**: Connected to the same [syncSigns](file:///d:/projects/tradexa/app/trade-input/page.tsx#107-125) logic as `pnl`. Negative Risk-Reward will force a negative PNL.

- **Emotion (`emotion`)**
  - **Type**: Select Dropdown (`string`).
  - **Options**: `Neutral`, `Disciplined`, `Confident`, `Greedy`, `Fearful`, `Anxious`, `Frustrated`.

- **General Notes & Reflection (`notes`)**
  - **Type**: Text Area (`string`).
  - **Row Count**: 3 (Vertically resizable).

---

## 2. End-to-End Update Flow

When a user intends to **Edit** an existing trade rather than create a new one, the [TradeInputForm](file:///d:/projects/tradexa/app/trade-input/page.tsx#31-372) conducts the following flow:

### Step A: Read Query Parameters
1. The page uses Next.js `useSearchParams()` to check for an `id` query parameter (e.g., `?id=123`).
2. This is mapped to the `editId` variable.

### Step B: Fetch Existing Trade Data & Populate Form
1. A `useEffect` hook listens for the presence of `editId`.
2. It executes an asynchronous **GET** request to: `/api/trades/${editId}`.
3. Upon a successful JSON response:
   - Sets local `formData` state.
   - Slices the returned UTC ISO Date down to `16` characters to correctly format it into the `<input type="datetime-local">` component (`YYYY-MM-DDThh:mm`).
   - Converts the `pnl` and `rr` fields to Strings to gracefully handle HTML input logic.

### Step C: Form Interaction (Signing & Validations)
1. User modifies values.
2. If `pnl` or `rr` are changed, the [handleChange](file:///d:/projects/tradexa/app/trade-input/page.tsx#126-147) function delegates to [syncSigns()](file:///d:/projects/tradexa/app/trade-input/page.tsx#107-125). This ensures that if the PNL is a loss (-), the RR reflects a loss (-), reducing data-entry errors.

### Step D: Submission & API Execution
1. The user clicks **Update Trade**, emitting the [handleSubmit](file:///d:/projects/tradexa/app/trade-input/page.tsx#62-106) React event.
2. **Payload Cleanup**: Standalone `-` values are stripped, and minus signs are re-verified across `pnl` and `rr`.
3. **HTTP Configuration**:
   - The application sets the method to [PUT](file:///d:/projects/tradexa/app/api/trades/route.ts#41-61).
   - The execution URL is: `/api/trades` (The `id` sits natively inside the `payload` object sent).
4. **Execution**:
   - Executes a `fetch` with `method: "PUT"` and `body: JSON.stringify(payload)`.
   - The backend `/api/trades` [PUT](file:///d:/projects/tradexa/app/api/trades/route.ts#41-61) block captures this payload, validates the User Session, ensures the trade `id` is present, and pushes the update to Prisma (`updateTrade` service).
5. **Redirection**: On HTTP 200/201 Success, the user is navigated back to `/overview` seamlessly.
