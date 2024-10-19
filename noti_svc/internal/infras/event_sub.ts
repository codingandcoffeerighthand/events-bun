import { createClient, type RedisClientType } from "redis";
import type { RedisConfig } from "../config/config";
import type { EventUpdateEvent } from "./events/eventUpdateEvent";
import { eventCancelTopic, eventUpdateTopic } from "../../../event_svc/internal/constant";

export interface IEventSub {
  subscribeUpdateEvent(callback: (event: EventUpdateEvent) => void): void
  subscribeCancelEvent(callback: (event: EventUpdateEvent) => void): void
}

export class EventSub implements IEventSub {
  protected client: RedisClientType
  constructor(cfg: RedisConfig) {
    this.client = createClient({
      url: cfg.url
    })
  }
  async connect() {
    await this.client.connect();
  }
  async quit() {
    await this.client.quit();
  }

  async subscribeUpdateEvent(callback: (event: EventUpdateEvent) => void) {
    try {
      await this.client.subscribe(eventUpdateTopic, (message) => {
        const event = JSON.parse(message) as EventUpdateEvent
        callback(event)
      })
    } catch (err) {
      console.log(err)
    }
  }
  async subscribeCancelEvent(callback: (event: EventUpdateEvent) => void) {
    try {
      await this.client.subscribe(eventCancelTopic, (message) => {
        const event = JSON.parse(message) as EventUpdateEvent
        callback(event)
      })
    } catch (err) {
      console.log(err)
    }

  }

}
