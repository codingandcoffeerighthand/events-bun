import type { EventDomain } from "../domain/events";

export interface IEventRepository {
	findById(id: string): Promise<EventDomain | null>;
	findAll(params: {
		search?: string;
		offset?: number;
		limit?: number;
	}): Promise<{ events: EventDomain[]; total: number }>;
	save(event: EventDomain): Promise<void>;
}
