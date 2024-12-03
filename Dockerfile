FROM oven/bun:latest AS build

WORKDIR /app

COPY bun.lockb ./
COPY package.json ./

RUN bun install --frozen-lockfile

COPY ./ ./

RUN bun build ./src/index.ts --compile --outfile cli

FROM ubuntu:22.04

WORKDIR /app

COPY --from=build /app/cli /app/cli

CMD ["/app/cli"]