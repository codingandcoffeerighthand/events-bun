import { getFlag } from "@shared/utils/getFlag"
import type { Config } from "../config/config"
import { getConfigs } from "@shared/utils/configs"
import { NotiService } from "../infras/noti/noti"
import { EventSub } from "../infras/event_sub"
import { Uc } from "../uc"

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
}

main()