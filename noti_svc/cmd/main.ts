import { getFlag } from "@shared/utils/getFlag"
import type { Config } from "../internal/config/config"
import { getConfigs } from "@shared/utils/configs"
import { NotiService } from "../internal/infras/noti/noti"
import { EventSub } from "../internal/infras/event_sub"
import { Uc } from "../internal/uc"

async function main() {
  const cfg = await getConfigs<Config>(getFlag("-c"))
  const service = new NotiService()
  const uc = new Uc(service)
  const eventSub = new EventSub(cfg.redis)
  await eventSub.connect()
  eventSub.subscribeUpdateEvent((event) => {
    uc.notiToAllAtendeesEventUpdate(event.event_id)
  })
  eventSub.subscribeCancelEvent((event) => {
    uc.notiToAllAtendeesEventCancel(event.event_id)
  })

  await new Promise((resolve) => {
    process.on('SIGINT', async () => {
      console.log('\nGracefully shutting down...');
      resolve(undefined);
    });
  });

}

main()