# BetTracker — Sports Betting Analytics SaaS

Professional-grade analytics for serious sports bettors.

## Stack
- **Frontend**: Next.js 14 (App Router) + Tailwind + RTK Query — FSD architecture
- **Backend**: NestJS + TypeORM + PostgreSQL
- **Monorepo**: Turborepo + npm workspaces
- **CI/CD**: GitLab CI
- **Monitoring**: Loki + Grafana

## Quick Start

### Prerequisites
- Node.js 20+
- Docker + Docker Compose
- npm 10+

### 1. Install dependencies
```bash
npm install
```

### 2. Start infrastructure (PostgreSQL + Grafana + Loki)
```bash
docker compose up postgres loki grafana -d
```

### 3. Start dev servers (both frontend + backend)
```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Grafana: http://localhost:3200 (admin/admin)

### 4. Setup Husky git hooks
```bash
npx husky install
```

## Claude Code Integration

This project is configured for Claude Code. Run in project root:
```bash
claude
```

Claude will read `CLAUDE.md` automatically and understand:
- Full project architecture
- FSD rules and import restrictions  
- TDD workflow
- Design system tokens

### Available skills
```
@fsd    — create new feature following FSD
@tdd    — test-driven workflow
@api    — NestJS endpoint creation
@design — UI component patterns
```

## Project Structure
```
bettracker/
├── CLAUDE.md                 # Claude Code instructions (always read)
├── .claude/skills/           # Task-specific Claude skills
├── apps/
│   ├── web/                  # Next.js 14 frontend
│   │   └── src/
│   │       ├── app/          # Next.js App Router
│   │       ├── widgets/      # Complex UI blocks
│   │       ├── features/     # User interactions
│   │       ├── entities/     # Business entities
│   │       └── shared/       # Reusable primitives
│   └── api/                  # NestJS backend
│       └── src/
│           ├── bets/
│           ├── analytics/
│           ├── auth/
│           └── users/
├── packages/
│   └── shared/               # Shared types & DTOs
├── .gitlab-ci.yml            # CI/CD pipeline
└── docker-compose.yml        # Local dev + production
```

## Scripts
```bash
npm run dev       # Start all apps
npm run build     # Build all apps
npm run test      # Run all tests
npm run lint      # Lint all apps
npm run format    # Format with Prettier
```

## Environment Variables

Copy and fill:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```
