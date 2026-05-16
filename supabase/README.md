# Supabase backend — Nutra Elixoria

## What works without extra setup

| Piece | Status |
|-------|--------|
| Save order to database | Works (Edge Function + `orders` table) |
| Customer confirmation page | Works after successful checkout |
| Gmail / email notifications | **Not automatic** — needs Resend secrets (see below) |

**Edge Function alone is not enough for email.** It saves the order; Resend sends the messages.

---

## Check if orders are saving

1. [Supabase Dashboard](https://supabase.com/dashboard/project/vqdypjshpoaiodfofazn/editor) → **Table Editor** → **`orders`**
2. You should see rows like `NE-100000` with customer name, email, total.
3. If `email_customer_sent` and `email_admin_sent` are **false**, email secrets are missing or Resend rejected the send.

---

## Enable emails (required for Gmail)

Secrets live in **Supabase** (not `.env`). Values are in `supabase/.env.functions` (gitignored).

**Option A — Dashboard:** [Edge Functions → place-order → Secrets](https://supabase.com/dashboard/project/vqdypjshpoaiodfofazn/functions/place-order/secrets)

| Secret name | Value |
|-------------|--------|
| `RESEND_API_KEY` | Your `re_...` key from Resend |
| `ORDER_FROM_EMAIL` | `Nutra Elixoria <onboarding@resend.dev>` (testing) |
| `ORDER_NOTIFY_EMAIL` | `balochanas321@gmail.com` |

**Option B — CLI:** `npx supabase login` then `.\scripts\push-supabase-secrets.ps1`

No redeploy after saving secrets; the next order sends email.

### Why `email_customer_sent` / `email_admin_sent` stay false

Secrets are OK, but **Resend rejected the send**. On the free/test plan, Resend only allows:

- **FROM:** `onboarding@resend.dev`
- **TO:** the email you used to sign up for Resend (**msakithub0702@gmail.com**)

It will **not** send to `balochanas321@gmail.com` or customer addresses like `230431@students.au.edu.pk` until you [verify your domain](https://resend.com/domains) (e.g. nutraelixoria.com) and set **FROM** to something like `orders@nutraelixoria.com`.

**Quick fix for admin alerts now:** set `ORDER_NOTIFY_EMAIL` to `msakithub0702@gmail.com` in Supabase secrets (and `ORDER_FROM_EMAIL` to `onboarding@resend.dev`).

**Production:** verify domain → use `ORDER_FROM_EMAIL=Nutra Elixoria <orders@nutraelixoria.com>` → then any customer email works.

---

## Who gets what

| Who | How they know |
|-----|----------------|
| **You** | Email to `ORDER_NOTIFY_EMAIL` + row in Supabase `orders` |
| **Customer** | Confirmation page + email to checkout email address |

---

## Deployed

- **Tables:** `orders`, `order_items`
- **Function:** `get_next_order_ref()`
- **Edge Function:** `place-order` (JWT + anon key from frontend)

## Local frontend

`.env` or `.env.local`:

```
VITE_SUPABASE_URL=https://vqdypjshpoaiodfofazn.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key from Supabase → Settings → API>
```
