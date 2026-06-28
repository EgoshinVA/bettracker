FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json turbo.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/

RUN npm ci

COPY packages/shared packages/shared
COPY apps/api apps/api

RUN (cd packages/shared && npx tsc) && (cd apps/api && npx nest build)

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/apps/api/dist apps/api/dist
COPY --from=builder /app/packages/shared/dist packages/shared/dist

EXPOSE 3001

HEALTHCHECK --interval=10s --timeout=5s --start-period=30s \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

USER node

CMD ["node", "apps/api/dist/main"]
