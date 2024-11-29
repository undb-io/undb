FROM node:22 as builder

ARG CDN_URL
ENV PUBLIC_CDN_URL=$CDN_URL

WORKDIR /usr/src/app

RUN npm i -g bun

FROM builder AS install

RUN mkdir -p /temp/dev
COPY . /temp/dev/
RUN cd /temp/dev && bun install

FROM builder AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
RUN mkdir .undb

ENV NODE_ENV=production
ENV PORT=3721
RUN bun run build:docker

RUN bunx rimraf node_modules
RUN bun install --production

# Add Tini init-system
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static /tini
RUN chmod +x /tini

FROM oven/bun AS release

ENV NODE_ENV=production
ENV PORT=3721

WORKDIR /usr/src/app

RUN mkdir .undb
RUN mkdir .undb/storage

COPY --from=prerelease /usr/src/app/apps/backend/undb .
COPY --from=prerelease /usr/src/app/node_modules ./node_modules
COPY --from=prerelease /usr/src/app/apps/backend/drizzle ./drizzle
COPY --from=prerelease /usr/src/app/apps/backend/assets ./assets
COPY --from=prerelease /usr/src/app/apps/backend/src/modules/mail ./mail
COPY --from=prerelease /usr/src/app/packages ./packages
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/apps/frontend/dist ./dist
COPY --from=prerelease /tini /tini

# run the app
EXPOSE 3721/tcp
ENTRYPOINT ["/tini", "--"]
CMD [ "./undb" ]

