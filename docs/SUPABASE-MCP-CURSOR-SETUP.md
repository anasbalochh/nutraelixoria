# Connect Supabase MCP to Cursor

Guide for wiring **Supabase’s official MCP server** into **Cursor** so the AI can manage your Nutra Elixoria Supabase project: run SQL, apply migrations, deploy Edge Functions, generate TypeScript types, read logs, and search Supabase docs — without leaving the editor.

Use this together with [ORDER-NOTIFICATIONS-PLAN.md](./ORDER-NOTIFICATIONS-PLAN.md) when implementing checkout + `place-order`.

---

## What you get

| Capability | MCP tools (examples) |
|------------|----------------------|
| Database | `list_tables`, `execute_sql`, `apply_migration`, `list_migrations` |
| Edge Functions | `list_edge_functions`, `get_edge_function`, `deploy_edge_function` |
| App wiring | `get_project_url`, `get_publishable_keys`, `generate_typescript_types` |
| Debugging | `get_logs`, `get_advisors` |
| Docs | `search_docs` |
| Account (optional) | `list_projects`, `create_project` — disabled if you scope to one project |

Cursor will **ask you to approve each tool call** by default. Keep that on and read every action before accepting.

---

## Prerequisites

| Requirement | Notes |
|-------------|--------|
| [Cursor](https://cursor.com) | MCP stable in recent versions; use **Settings → Tools & MCP** |
| [Supabase account](https://supabase.com) | Create a **dev** project for this shop (not production customer data) |
| Supabase **Project ID** | Dashboard → **Project Settings → General** → **Reference ID** (`project_ref`) |
| (Optional) [Supabase CLI](https://supabase.com/docs/guides/cli) | For local DB + `http://localhost:54321/mcp` |

---

## Recommended setup (hosted MCP + OAuth)

Supabase hosts the MCP server at `https://mcp.supabase.com/mcp`. Cursor opens a browser once so you log in and grant access — **no personal access token in a file** for day-to-day use.

### Step 1 — Get your project-scoped URL

1. Open [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your **Nutra Elixoria** (dev) project.
3. Go to **Connect** (or **Project Settings**) → **MCP** tab,  
   or open:  
   `https://supabase.com/dashboard/project/<your-project-ref>?showConnect=true&connectTab=mcp`
4. Copy the generated URL. It should look like:

```text
https://mcp.supabase.com/mcp?project_ref=abcdefghijklmnop
```

**Strongly recommended** query params for safer AI use:

```text
https://mcp.supabase.com/mcp?project_ref=YOUR_PROJECT_REF&read_only=false
```

| Param | When to use |
|-------|-------------|
| `project_ref=...` | **Always** — limits MCP to one project |
| `read_only=true` | Exploring / querying only; blocks migrations and deploys |
| `read_only=false` | Building orders schema + Edge Functions (Phase A in order plan) |
| `features=database,docs,functions,development` | Limit tools to what you need |

Example (write access, only DB + functions + docs):

```text
https://mcp.supabase.com/mcp?project_ref=YOUR_PROJECT_REF&features=database,docs,functions,development
```

### Step 2 — Add MCP config in Cursor

**Option A — This repo only (recommended)**

Create `.cursor/mcp.json` in the project root:

```json
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp?project_ref=YOUR_PROJECT_REF"
    }
  }
}
```

Replace `YOUR_PROJECT_REF` with your real reference ID.

**Option B — All Cursor projects (global)**

Edit `%USERPROFILE%\.cursor\mcp.json` (Windows) or `~/.cursor/mcp.json` (macOS/Linux) with the same block.

> Do **not** commit real tokens to git. The hosted URL uses OAuth; no secret is required in the JSON for normal use.

### Step 3 — Enable in Cursor UI

1. **Cursor → Settings → Cursor Settings → Tools & MCP**
2. Find **supabase** in the list.
3. If status is disconnected, click to connect / authorize.
4. Complete **Supabase login** in the browser and pick the org that owns your project.
5. **Restart Cursor** if tools do not appear immediately.

### Step 4 — Verify

In **Agent** or **Composer**, try:

```text
Use the Supabase MCP tools: list all tables in my project.
```

or:

```text
Search Supabase docs for Edge Functions secrets. Use MCP.
```

You should see tool calls like `list_tables` or `search_docs` pending your approval.

---

## Alternative: Personal Access Token (no browser OAuth)

Use when OAuth fails or for automation. **Never commit the token.**

1. [Account → Access Tokens](https://supabase.com/dashboard/account/tokens) → **Generate new token**.
2. Name it e.g. `Cursor MCP – Nutra Elixoria dev`.
3. Configure MCP (if your Cursor build supports `headers` on HTTP MCP):

```json
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp?project_ref=YOUR_PROJECT_REF",
      "headers": {
        "Authorization": "Bearer YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

Store the token in an environment variable when possible; reference it only in **global** Cursor config outside the repo.

Official reference: [Supabase MCP — Manual authentication (CI)](https://supabase.com/docs/guides/ai-tools/mcp#manual-authentication)

---

## Alternative: `npx` stdio server (legacy / local tooling)

Some guides use the npm package. Supabase’s **current default** is the **hosted HTTP** server above; use npx only if you prefer stdio or docs for your Cursor version require it.

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

Requires **Node.js 18+** on PATH. Scope the token to the same dev project you use for Nutra Elixoria.

Package: [@supabase/mcp-server-supabase](https://www.npmjs.com/package/@supabase/mcp-server-supabase)  
Repo: [github.com/supabase-community/supabase-mcp](https://github.com/supabase-community/supabase-mcp)

---

## Local Supabase CLI + MCP

When running `supabase start` locally:

```json
{
  "mcpServers": {
    "supabase-local": {
      "type": "http",
      "url": "http://localhost:54321/mcp"
    }
  }
}
```

Local MCP has a **smaller tool set** and no OAuth. Good for offline migration tests; deploy Edge Functions to cloud separately.

---

## What to ask Cursor after MCP is connected

Examples aligned with [ORDER-NOTIFICATIONS-PLAN.md](./ORDER-NOTIFICATIONS-PLAN.md):

```text
Using Supabase MCP, apply a migration for orders and order_items tables
from docs/ORDER-NOTIFICATIONS-PLAN.md section 5. Use apply_migration.
```

```text
Deploy a place-order Edge Function that validates checkout JSON,
inserts into orders + order_items, and documents Resend env vars.
Use MCP deploy_edge_function and get_edge_function.
```

```text
Generate TypeScript types for the public schema and save to src/lib/database.types.ts
```

```text
Run get_advisors and fix any security issues on the orders tables (RLS).
```

```text
Fetch the last 20 postgres logs after a failed test order. Use get_logs.
```

---

## Suggested MCP modes for this project

| Phase | `read_only` | `features` |
|-------|-------------|------------|
| Planning / reviewing data | `true` | `database,docs` |
| Implementing orders + `place-order` | `false` | `database,functions,development,docs` |
| Debugging live issues | `true` | `database,debugging` |

Switch the URL in `.cursor/mcp.json` when you change mode, then reload MCP in Cursor settings.

---

## Security (read before enabling write tools)

Supabase MCP runs with **your developer permissions**, not your customers’ RLS.

| Do | Don’t |
|----|--------|
| Use a **dev** Supabase project | Point MCP at production PII |
| Keep **project_ref** set | Leave access to all org projects |
| Approve each tool call in Cursor | Auto-run destructive SQL |
| Use `read_only=true` when only exploring | Expose MCP config with PAT in git |
| Use [database branches](https://supabase.com/docs/guides/deployment/branching) on paid plans for risky schema work | Give MCP access to end users |

Full guide: [Supabase MCP security risks](https://supabase.com/docs/guides/ai-tools/mcp#security-risks)

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| No **supabase** server in Tools & MCP | Add `.cursor/mcp.json`, restart Cursor |
| OAuth loop / not connected | Settings → Tools & MCP → reconnect; correct Supabase org |
| Tools listed but calls fail | Confirm `project_ref` matches dashboard; project not paused |
| `apply_migration` disabled | Remove `read_only=true` from URL |
| `deploy_edge_function` fails | Check function name, secrets in dashboard, function logs via `get_logs` |
| PAT / headers ignored | Use hosted OAuth instead; check Cursor version supports HTTP MCP headers |
| Wrong database | You scoped the wrong `project_ref` — update URL |
| MCP works but site doesn’t | MCP ≠ app env; still set `VITE_SUPABASE_URL` and anon key in Cloudflare/Vite |

---

## `.gitignore` reminder

If you add secrets for local MCP or Supabase CLI:

```gitignore
.env
.env.local
.supabase/
```

Commit only **`.cursor/mcp.json` with project_ref** (no tokens). Use dashboard OAuth for tokens.

---

## Quick reference links

| Resource | URL |
|----------|-----|
| Official Supabase MCP docs | https://supabase.com/docs/guides/ai-tools/mcp |
| Dashboard MCP connect tab | https://supabase.com/dashboard/project/_/settings/general (then Connect → MCP) |
| Access tokens | https://supabase.com/dashboard/account/tokens |
| AI prompts (Supabase) | https://supabase.com/docs/guides/getting-started/ai-prompts |
| Order implementation plan | [ORDER-NOTIFICATIONS-PLAN.md](./ORDER-NOTIFICATIONS-PLAN.md) |

---

## Checklist

- [ ] Supabase dev project created  
- [ ] `project_ref` copied from dashboard  
- [ ] `.cursor/mcp.json` added with scoped URL  
- [ ] Cursor **Tools & MCP** shows **supabase** connected (OAuth done)  
- [ ] Test prompt: `list_tables` succeeds  
- [ ] `read_only` / `features` adjusted for current work  
- [ ] Order plan implementation uses MCP for migrations + `place-order` deploy  

---

*Document version: 2026-05-17 — Supabase hosted MCP (`mcp.supabase.com`) + Cursor `.cursor/mcp.json`.*
