# Nutra Elixoria

Pakistan's premier nutraceuticals storefront — an editorial e-commerce experience for **GLUTAGE**, a daily L-Glutathione + marine collagen shot manufactured under licence NHM0089.

Built with TanStack Start (React 19 + Vite), Tailwind CSS v4, and a Supabase backend that records orders and triggers customer + admin email notifications.

---

## Tech Stack

- **Frontend:** React 19, TanStack Start / Router, Vite 7, Tailwind CSS v4, Radix UI, Embla carousel
- **Backend:** Supabase (Postgres, Edge Functions, RLS)
- **Email:** Resend API (transactional customer + admin notifications)
- **Hosting:** Cloudflare Pages / Workers (via `@cloudflare/vite-plugin`, `wrangler`)
- **Validation:** Zod, React Hook Form

---

## Features

- Editorial luxury landing page with reveal animations and Embla testimonial carousel
- Product page with `compareAt` pricing and dynamic discount calculation
- Cart drawer with persisted state and quantity controls
- Checkout flow with full address capture, COD / bank transfer, and idempotent order placement
- Order confirmation page with full order summary and discount breakdown
- Supabase Edge Function `place-order` that:
  - Validates input
  - Generates a sequential order reference via Postgres RPC
  - Persists `orders` + `order_items` rows with RLS
  - Sends a confirmation email to the customer and a new-order alert to the business

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env.local`

Copy the template and fill in your Supabase project credentials (Project Settings → API):

```bash
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-public-key>
```

### 3. Run the dev server

```bash
npm run dev
```

The site is served at `http://localhost:5173`.

---

## Supabase Backend

The `supabase/` folder contains the database schema and the Edge Function powering order placement.

### Database

Apply the migration in `supabase/migrations/001_orders.sql` to create:

- `orders` table (with `idempotency_key`, totals, status flags)
- `order_items` table
- `order_ref_seq` sequence + `get_next_order_ref()` function
- Row Level Security policies

### Edge Function — `place-order`

Deploy via the Supabase CLI:

```bash
npx supabase functions deploy place-order
```

Required secrets (set with `npx supabase secrets set KEY=value` or via `scripts/push-supabase-secrets.ps1`):

| Secret | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend transactional email API key |
| `ORDER_FROM_EMAIL` | "From" address (must be on a verified domain) |
| `ORDER_NOTIFY_EMAIL` | Business inbox for new-order alerts |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed origins for CORS |

> **Note:** Resend's free tier only delivers email *from* `onboarding@resend.dev` and *to* the Resend account owner's email unless you verify a custom domain.

See `supabase/README.md` and `docs/ORDER-NOTIFICATIONS-PLAN.md` for full details.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run build:dev` | Build with the development env |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |

---

## Project Structure

```
src/
  assets/              Images and static media
  components/
    site/              Layout, Navbar, Footer, CartDrawer, Testimonials
    ui/                Radix-based primitives
  hooks/               useReveal, useMobile
  lib/                 cart, orders, supabase, product, blog-posts, utils
  routes/              TanStack file-based routes (index, about, checkout, ...)
supabase/
  functions/place-order/   Order placement Edge Function
  migrations/              SQL schema
docs/
  ORDER-NOTIFICATIONS-PLAN.md
  SUPABASE-MCP-CURSOR-SETUP.md
```

---

## License

All rights reserved © Nutra Elixoria.
