# @fsd — Feature-Sliced Design

Use this skill when creating any new feature, entity, or widget.

## Creating a new Feature

```
apps/web/src/features/<feature-name>/
├── ui/
│   ├── <ComponentName>.tsx
│   └── <ComponentName>.test.tsx
├── model/
│   ├── <feature>.slice.ts
│   ├── <feature>.selectors.ts
│   └── <feature>.slice.test.ts
├── api/
│   └── <feature>.api.ts        # RTK Query endpoints
├── lib/
│   └── <helper>.ts
└── index.ts                    # PUBLIC API — export only what's needed
```

## index.ts (barrel export) — always explicit
```ts
// features/add-bet/index.ts
export { AddBetModal } from './ui/AddBetModal'
export { addBetApi } from './api/add-bet.api'
export type { AddBetFormData } from './model/add-bet.types'
// Never export internals
```

## Creating a new Entity
```
apps/web/src/entities/<entity>/
├── ui/
│   └── <Entity>Card.tsx
├── model/
│   ├── <entity>.types.ts
│   └── <entity>.mock.ts
├── api/
│   └── <entity>.api.ts
└── index.ts
```

## Creating a new Widget
```
apps/web/src/widgets/<widget>/
├── ui/
│   └── <Widget>.tsx
├── model/
└── index.ts
```

## Import rules (STRICT)
- app → pages → widgets → features → entities → shared
- NEVER import from upper layers
- NEVER cross-import between features
- Always import through index.ts barrel
