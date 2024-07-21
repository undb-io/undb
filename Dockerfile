FROM node:20 AS base

WORKDIR /usr/src/app

RUN npm i -g bun

FROM base AS install

RUN mkdir -p /temp/dev
COPY . /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
RUN mkdir .undb

ENV NODE_ENV=production
ENV PORT=3000
RUN bun run build

# Add Tini init-system
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static /tini
RUN chmod +x /tini

FROM gcr.io/distroless/base:nonroot AS release

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /usr/src/app
COPY --from=prerelease /usr/src/app/apps/backend/undb .
COPY --from=prerelease /usr/src/app/.undb ./.undb
COPY --from=prerelease /usr/src/app/apps/backend/drizzle ./drizzle
COPY --from=prerelease /usr/src/app/apps/frontend/dist ./dist
COPY --from=prerelease /tini /tini

# run the app
EXPOSE 3000/tcp
ENTRYPOINT ["/tini", "--"]
CMD [ "./undb" ]