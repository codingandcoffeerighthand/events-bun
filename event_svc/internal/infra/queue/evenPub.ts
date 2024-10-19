import type { RedisConfig } from "../../configs/config";
import { eventCancelTopic, eventUpdateTopic } from "../../constant";
import type { EventUpdateEvent } from "./events/eventUpdateEvent";
import * as redis from 'redis'

export interface IEventPub {
  publishUpdateEvent(event: EventUpdateEvent): Promise<void>;
  publishtCancelEvent(event: EventUpdateEvent): Promise<void>;
}

export class EventPub implements IEventPub {
  client: redis.RedisClientType;
  constructor(cfg: RedisConfig) {
    this.client = redis.createClient({
      url: cfg.url,
    });
    this.client.on("error", (err) => {
      console.log("Redis Client Error", err);
    });
  }
  async publishtCancelEvent(event: EventUpdateEvent): Promise<void> {
    try {
      await this.client.publish(eventCancelTopic, JSON.stringify(event));
    } catch (err) {
      console.log(err);
    }
  }
  async connect() {
    await this.client.connect();
  }
  async quit() {
    await this.client.quit();
  }
  async publishUpdateEvent(event: EventUpdateEvent) {
    try {
      await this.client.publish(eventUpdateTopic, JSON.stringify(event));
    } catch (err) {
      console.log(err);
    }
  }
}