import type { EventDomain } from "../../domain/events";
import type { IEventRepository } from "../eventRepo";
import { EventDomainModel, mapToEventDomain } from "./schema";

export class EventDomainRepo implements IEventRepository {
	async findAll(params: {
		search?: string;
		offset?: number;
		limit?: number;
	}): Promise<{ events: EventDomain[]; total: number }> {
		const { search, offset = 0, limit = 10 } = params;
		let query = EventDomainModel.find();
		if (search) {
			query = query.find({ $text: { $search: search } });
		}
		const total = await EventDomainModel.countDocuments(query.getFilter());
		const docs = await query.skip(offset).limit(limit).exec();
		const events = docs.map(mapToEventDomain);
		return { events, total };
	}
	async findById(id: string): Promise<EventDomain | null> {
		const doc = await EventDomainModel.findById(id);
		return doc ? mapToEventDomain(doc) : null;
	}

	async save(event: EventDomain): Promise<void> {
		await EventDomainModel.findByIdAndUpdate(
			event.id,
			{
				title: event.title,
				description: event.description,
				start_date: event.start_date,
				end_date: event.end_date,
				location: event.location,
				organizer: event.organizer,
				attendees: event.attendees,
			},
			{
				upsert: true,
			},
		);
	}
}
