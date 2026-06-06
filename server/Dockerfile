FROM node:22-alpine AS builder

RUN npm install -g pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma/
COPY prisma.config.ts ./prisma.config.ts

RUN pnpm install --frozen-lockfile
RUN DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy pnpm prisma generate
COPY . .
RUN pnpm build

# ── Production ──────────────────────────────────
FROM node:22-alpine AS production

RUN npm install -g pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma/
COPY prisma.config.ts ./prisma.config.ts

RUN pnpm install --frozen-lockfile --prod
RUN pnpm add prisma --save-dev   # install CLI only
RUN DATABASE_URL=... pnpm prisma generate
RUN pnpm remove prisma           # optional cleanup

RUN DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy pnpm prisma generate

COPY --from=builder /app/dist ./dist

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 5001

CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/src/main"]