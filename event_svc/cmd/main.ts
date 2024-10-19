import { getConfigs } from "@shared/utils/configs";
import type { Config } from "../internal/configs/config";
import { getFlag } from "@shared/utils/getFlag";
import { connectMongo } from "../internal/infra/mongo/db";
import { EventDomainRepo } from "../internal/infra/mongo/repo";
import { EventPub } from "../internal/infra/queue/evenPub";
import { EventUc } from "../internal/uc/events/uc";
import { EventService } from "../internal/app/service";
import { GrpcServer } from "../internal/app/app";

async function main() {
  let cleanup: () => void = () => { };
  const config = await getConfigs<Config>(getFlag("-c"));
  if (!connectMongo(config.mongo)) {
    throw new Error("MongoDB not connected");
  }
  try {
    const repo = new EventDomainRepo()
    const eventPub = new EventPub(config.redis);
    await eventPub.connect();
    cleanup = () => {
      eventPub.quit();
      cleanup = () => { };
    };
    const uc = new EventUc(repo, eventPub);
    const service = new EventService(uc);
    const server = new GrpcServer(service.service, config.addr);
    server.start();
  } catch (error) {
    // biome-ignore lint/complexity/noUselessCatch: <explanation>
    throw error;
  } finally {
    cleanup();
  }

}

try {
  await main();
} catch (error) {
  // biome-ignore lint/complexity/noUselessCatch: <explanation>
  throw error;
}