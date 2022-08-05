FROM node:16-alpine AS base

RUN corepack enable && corepack prepare pnpm@7.8.0 --activate

RUN addgroup -S app && adduser -S app -G app

RUN mkdir /app
RUN chown -R app:app /app

USER app
WORKDIR /app/

FROM base AS build

COPY package.json pnpm-lock.yaml ./
RUN pnpm install  --frozen-lockfile

COPY .swcrc  .
COPY src/ src/

RUN pnpm build

FROM base

COPY --chown=app:app package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --chown=app:app --from=build /app/dist/ /app/dist/

EXPOSE 8080

CMD pnpm start
