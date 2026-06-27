# BetTracker — Claude Instructions

## Project Overview
Sports betting analytics SaaS. Users track bets and analyze ROI, win rate, profit by sport/bookmaker.
Monetization: subscription $19/month (Pro Plan) via Stripe.
Target: serious bettors who want data-driven decisions.

## Monorepo Structure
```
bettracker/
├── apps/
│   ├── web/          # Next.js 14 frontend (port 3000)
│   └── api/          # NestJS backend (port 3001)
├── packages/
│   └── shared/       # Shared types, DTOs, constants
├── CLAUDE.md         # This file — always read first
└── .claude/skills/   # Task-specific skill files
```

## Tech Stack

### Frontend (apps/web)
- Next.js 14 with App Router
- TypeScript (strict mode, no `any`)
- Tailwind CSS
- RTK Query for data fetching
- Redux Toolkit for state
- Feature-Sliced Design (FSD) architecture

### Backend (apps/api)
- NestJS
- TypeORM + PostgreSQL
- class-validator + class-transformer for DTOs
- JWT auth (access + refresh tokens)
- Passport.js

### DevOps
- GitLab CI/CD (.gitlab-ci.yml)
- Docker + docker-compose
- Loki + Grafana for monitoring

## Architecture: Feature-Sliced Design (FSD)

```
apps/web/src/
├── app/              # Next.js App Router (routing only, no logic)
├── pages/            # Page-level components
├── widgets/          # Complex UI blocks (Sidebar, Header, BetsTable)
├── features/         # User interactions (add-bet, filter-bets, auth)
├── entities/         # Business entities (bet, bookmaker, user)
├── shared/           # Reusable primitives (ui, lib, api, config)
```

**Import rules (strict):**
- app → pages → widgets → features → entities → shared
- NEVER import from upper layers
- Each feature exports only through `index.ts` (barrel export)
- No cross-feature imports

## Code Standards

### General
- TDD: write tests BEFORE implementation
- No `any` in TypeScript — use proper types or `unknown`
- Conventional commits: `feat:`, `fix:`, `chore:`, `test:`, `refactor:`
- Branch per feature: `feature/add-bet-form`, `fix/dashboard-stats`

### Frontend
- Components: functional only, hooks for logic
- Styles: Tailwind only, no inline styles, no CSS modules
- Forms: React Hook Form + Zod validation
- Tests: Jest + React Testing Library

### Backend
- Every endpoint has DTO with class-validator decorators
- Every service has unit tests
- Every controller has e2e tests
- Repository pattern for data access
- No business logic in controllers

## Design System

### Colors
- Background: `white` / `slate-50`
- Text primary: `slate-900`
- Text secondary: `slate-500`
- Accent: `violet-600` (buttons, active states, highlights)
- Accent light: `violet-50` (backgrounds)
- Success: `green-500`
- Error: `red-500`
- Warning: `amber-500`

### Components
- Cards: `rounded-xl border border-slate-100 shadow-sm bg-white p-6`
- Buttons primary: `bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2`
- Inputs: `border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500`
- Sidebar width: `w-56`

### Typography
- Font: Inter (Google Fonts)
- Headings: `font-bold text-slate-900`
- Body: `text-slate-600`
- Captions: `text-slate-400 text-sm`

## Skills Reference
Use `@skill-name` to load task-specific instructions:
- `@fsd` — create new feature following FSD rules
- `@tdd` — write tests first workflow
- `@api` — create NestJS endpoint
- `@design` — UI component patterns

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bettracker
JWT_SECRET=your-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
STRIPE_SECRET_KEY=sk_test_...
PORT=3001
```
