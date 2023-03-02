FROM node:18 as builder

WORKDIR /egodb

ARG MAX_OLD_SPACE_SIZE=4096

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY ./pnpm-lock.yaml ./

RUN pnpm fetch

COPY . ./

RUN pnpm install -r --offline

RUN pnpm run build

FROM node:18-bullseye as runner

WORKDIR /egodb

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

ARG EGODB_API_TRPC_URL=http://localhost:4000/api/trpc
ENV EGODB_API_TRPC_URL=${EGODB_API_TRPC_URL}
ENV NODE_ENV production

COPY --from=builder /egodb/package.json ./
COPY --from=builder /egodb/node_modules ./node_modules
COPY --from=builder /egodb/apps/web ./apps/web

EXPOSE 3000

CMD [ "pnpm", "--filter", "web", "run", "start" ]