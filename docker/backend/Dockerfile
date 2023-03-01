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

ENV EGODB_API_TRPC_URL=http://localhost:4000/api/trpc
ENV NODE_ENV production

COPY --from=builder /egodb/package.json ./
COPY --from=builder /egodb/node_modules ./node_modules
COPY --from=builder /egodb/apps/backend ./apps/backend

EXPOSE 4000

CMD [ "pnpm", "--filter", "backend", "run", "start:prod" ]