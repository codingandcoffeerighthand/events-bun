import type { NotiService } from "./infras/noti/noti";

export class Uc {
  constructor(
    private readonly _notiService: NotiService
  ) { }
  notiToAllAtendeesEventCancel(event_id: string) {
    this._notiService.sendNoti(`get info about cancel event ${event_id} and noti to all atendees`);
  };
  notiToAllAtendeesEventUpdate(event_id: string) {
    this._notiService.sendNoti(`get info about updated event ${event_id} and noti to all atendees`);
  };
}