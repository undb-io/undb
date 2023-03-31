# builder
FROM node:18-bullseye-slim as builder

WORKDIR /egodb

RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=@egodb/web

# installer
FROM node:18-bullseye AS installer

RUN npm install -g pnpm

WORKDIR /egodb

COPY --from=builder /egodb/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm fetch

COPY --from=builder /egodb/out/ .

RUN pnpm install -r --offline
RUN pnpm run build --filter=web
RUN pnpm prune --prod --config.ignore-scripts=true

# runner
FROM gcr.io/distroless/nodejs18-debian11 as runner

WORKDIR /egodb

COPY --from=installer /egodb/apps/web/next.config.js .
COPY --from=installer /egodb/apps/web/package.json .

COPY --from=installer /egodb/apps/web/.next/standalone ./
COPY --from=installer /egodb/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer /egodb/apps/web/public ./apps/web/public

CMD ["apps/web/server.js"]
