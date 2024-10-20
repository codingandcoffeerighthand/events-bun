FROM oven/bun as builder

WORKDIR /app

COPY ../ .

RUN bun install

RUN bun build ./user_svc/cmd/main.ts  --compile --outfile=./user_svc/app

ENTRYPOINT [ "./user_svc/app", "-c", "./user_svc/configs.yaml" ]