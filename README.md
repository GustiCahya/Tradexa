# Tradexa

Tradexa is a premium trading journal for serious traders. Track your performance, analyze your mistakes, and elevate your trading edge.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Neon PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js (Auth.js)
- **Charts:** Recharts
- **Icons:** Lucide React

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up your `.env` and `.env.production.local` with your Neon Database URL and NextAuth secret.
4. Run Prisma db push:
   ```bash
   npx prisma db push
   ```
5. Run the development server:
   ```bash
   pnpm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Documentation (For Flutter Recreation)

If you are looking to recreate this application in another framework like Flutter, detailed documentation has been provided in the `docs` directory:

- [Features Overview](docs/features.md)
- [Design System & UI Guidelines](docs/design_system.md)
- [API & Backend Implementation](docs/api_implementation.md)
