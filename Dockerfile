# builder
FROM node:18-bullseye-slim as builder

WORKDIR /undb

RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=@undb/backend --scope=@undb/frontend

# installer
FROM node:18-bullseye AS installer

RUN npm install -g pnpm

WORKDIR /undb

COPY --from=builder /undb/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm fetch

COPY --from=builder /undb/out/ .

RUN pnpm install -r --offline

ARG PUBLIC_UNDB_ADMIN_EMAIL
ARG PUBLIC_UNDB_ADMIN_PASSWORD

ENV NODE_ENV production
RUN pnpm run build --filter=backend --filter=frontend

RUN rm -rf ./node_modules
RUN HUSKY=0 pnpm install -r --prod

# runner
FROM gcr.io/distroless/nodejs18-debian11 as runner

WORKDIR /undb

ENV NODE_ENV production
ENV UNDB_DATABASE_SQLITE_DATA /var/opt/.undb

COPY --from=installer /undb/node_modules ./node_modules
COPY --from=installer /undb/packages ./packages
COPY --from=installer /undb/apps/backend ./apps/backend
COPY --from=installer /undb/apps/frontend/build ./out

CMD ["apps/backend/dist/main.js"]
