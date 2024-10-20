FROM oven/bun AS builder

WORKDIR /app

COPY ../ .

RUN bun install

RUN bun build ./event_svc/cmd/main.ts  --compile --outfile=./event_svc/app

ENTRYPOINT [ "./event_svc/app", "-c", "./event_svc/configs.yaml" ]