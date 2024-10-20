FROM oven/bun AS builder

WORKDIR /app

COPY . .


RUN bun install

RUN bun build ./noti_svc/cmd/main.ts  --compile --outfile=./noti_svc/app

ENTRYPOINT [ "./noti_svc/app", "-c", "./noti_svc/configs.yaml" ]

