# builder
FROM node:18-bullseye-slim as builder

WORKDIR /egodb

RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=@egodb/backend

# installer
FROM node:18-bullseye-slim AS installer

RUN npm install -g pnpm

WORKDIR /egodb

COPY --from=builder /egodb/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm fetch

COPY --from=builder /egodb/out/ .

RUN pnpm install -r --offline

ENV NODE_ENV production
RUN pnpm run build --filter=backend
RUN pnpm prune --prod --config.ignore-scripts=true

# runner
FROM node:18-bullseye-slim as runner

WORKDIR /egodb

ENV NODE_ENV production

RUN npm install -g pnpm

COPY --from=installer /egodb/package.json ./
COPY --from=installer /egodb/node_modules ./node_modules
COPY --from=installer /egodb/apps/backend ./apps/backend

CMD ["pnpm", "--filter", "backend", "run", "start:prod"]
