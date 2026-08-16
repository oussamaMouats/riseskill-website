# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY packages/shared/package.json packages/shared/package.json
COPY packages/shared/tsconfig.json packages/shared/tsconfig.json
COPY packages/shared/tsup.config.ts packages/shared/tsup.config.ts
COPY packages/shared/src packages/shared/src
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
# packages/shared's "prepare" script (tsup) runs during this install, so its
# source must already be present here.
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
# apps/web's build script wraps `next build` with `dotenv -e ../../.env --`
# (for local dev parity); Docker has no .env, so create an empty one — the
# NEXT_PUBLIC_API_URL above is already in the process env via ARG/ENV and
# dotenv-cli never overrides existing env vars, so this is a no-op for values.
RUN touch .env
RUN pnpm --filter @riseskill/shared run build
RUN pnpm --filter @riseskill/web run build

FROM node:20-alpine AS runtime
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /app/apps/web/public ./apps/web/public
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', r => process.exit(r.statusCode < 500 ? 0 : 1)).on('error', () => process.exit(1))"
CMD ["node", "apps/web/server.js"]
