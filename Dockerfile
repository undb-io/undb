# builder
FROM node:20.6.1 as builder

WORKDIR /undb

COPY . .
RUN npx turbo@1.10.3 prune --scope=@undb/backend --scope=@undb/frontend

ADD https://github.com/benbjohnson/litestream/releases/download/v0.3.9/litestream-v0.3.9-linux-amd64-static.tar.gz /tmp/litestream.tar.gz
RUN tar -C /usr/local/bin -xzf /tmp/litestream.tar.gz

# installer
FROM node:20.6.1 AS installer

RUN npm install -g pnpm@8.7.6

WORKDIR /undb

COPY --from=builder /undb/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm fetch

COPY --from=builder /undb/out/ .

RUN pnpm install -r --prefer-offline

ARG PUBLIC_UNDB_ANALYTICS_DOMAIN
ARG PUBLIC_UNDB_ADMIN_EMAIL
ARG UNDB_HOST
ARG PUBLIC_UNDB_ADMIN_PASSWORD
ARG UNDB_SEED

ENV NODE_ENV production
ENV NODE_OPTIONS --max-old-space-size=8192
RUN pnpm run build --filter=backend --filter=frontend

RUN rm -rf ./node_modules
RUN HUSKY=0 pnpm install -r --prod

# runner
FROM node:20.6.1-bullseye-slim as runner

WORKDIR /undb

EXPOSE 4000

ENV NODE_ENV production
ENV NO_COLOR 1
ENV UNDB_DATABASE_SQLITE_DATA /var/opt/.undb

RUN npm install -g zx

COPY --from=installer /undb/node_modules ./node_modules
COPY --from=installer /undb/packages ./packages
COPY --from=installer /undb/apps/backend ./apps/backend
COPY --from=installer /undb/apps/frontend/build ./out
COPY --from=installer /undb/package.json ./
COPY --from=builder /usr/local/bin/litestream /usr/local/bin/litestream
COPY scripts/start.mjs ./scripts/start.mjs
COPY data/data.sql /data/data.sql

COPY litestream/etc/litestream.yml /etc/litestream.yml

RUN apt-get update \
	&& apt-get install -y --no-install-recommends ca-certificates

RUN update-ca-certificates

ENV TZ=UTC

CMD ["scripts/start.mjs"]
