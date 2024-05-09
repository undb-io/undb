FROM node:20 as base

WORKDIR /usr/src/app

RUN npm i -g bun

FROM base AS install

RUN mkdir -p /temp/dev
COPY . /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ENV NODE_ENV=production
ENV PORT=3000
RUN bun run build

FROM oven/bun:1.1-alpine AS release

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /usr/src/app
COPY --from=prerelease /usr/src/app/apps/backend/undb .
RUN mkdir .undb
COPY --from=prerelease /usr/src/app/apps/backend/drizzle ./drizzle
COPY --from=prerelease /usr/src/app/apps/frontend/dist ./dist

# run the app
EXPOSE 3000/tcp
CMD [ "./undb" ]