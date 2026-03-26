# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Auth**: JWT (jsonwebtoken) + Node.js crypto (scrypt)

## Artifacts

### `artifacts/digitpro` — DigitPro Platform (main web app at `/`)

Full-stack SaaS platform with the following services:

1. **Website Builder** — Templates personnalisables (name, logo, text) — 50 coins
2. **Virtual Phone Numbers** — Numbers for WhatsApp, Telegram, Instagram, TikTok, SMS — 30 coins
3. **Transfer Simulator** — Simulated bank transfers with shareable tracking link — 30 coins
4. **Transfer Document** — Fictitious wire transfer order PDF — 20 coins

**Coin system**: Users purchase coins via Oxapay (crypto), MTN Mobile Money, or Moov Money.
Packages: 60c=10,000 XOF, 150c=25,000 XOF, 350c=50,000 XOF, 750c=100,000 XOF.

**Pages**: Landing, Login, Register, Dashboard, Templates, My Websites, Phone Numbers, My Phones, Transfer Simulator, My Transfers, Track Transfer (public), Buy Coins, Transaction History, Settings.

### `artifacts/api-server` — Express API Server at `/api`

Handles all backend logic: auth, coins, templates, phones, transfers.

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── digitpro/           # React+Vite frontend (served at /)
│   └── api-server/         # Express API server (served at /api)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Database Schema

- `users` — Accounts with coin balance
- `coin_transactions` — Coin credit/debit history
- `websites` — Created websites from templates
- `purchased_phones` — Purchased virtual phone numbers
- `transfers` — Bank transfer simulations/documents

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes: `/api/auth/*`, `/api/coins/*`, `/api/templates`, `/api/websites`, `/api/phones/*`, `/api/transfers/*`.

- Auth: JWT tokens via `jsonwebtoken` + `crypto.scryptSync`
- Depends on: `@workspace/db`, `@workspace/api-zod`

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL.

- `pnpm --filter @workspace/db run push` — push schema to DB

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI 3.1 spec and Orval config. Run codegen: `pnpm --filter @workspace/api-spec run codegen`
