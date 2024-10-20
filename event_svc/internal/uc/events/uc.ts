import { ErrorResponse } from "@shared/utils/errors";
import { EventDomain } from "../../domain/events";
import type { IEventRepository } from "../../infra/eventRepo";
import {
	createEventInfo,
	type CancelEventRequest,
	type CreateEventParams,
	type EventInfo,
	type UpdateEventRequest,
} from "./eventParams";
import type { EventPub } from "../../infra/queue/evenPub";
import type { EventUpdateEvent } from "../../infra/queue/events/eventUpdateEvent";

export class EventUc {
	protected readonly _eventRepo: IEventRepository;
	constructor(eventRepo: IEventRepository,
		private readonly _eventPub: EventPub) {
		this._eventRepo = eventRepo;
	}

	async getEvent(id: string) {
		const event = await this._eventRepo.findById(id);
		if (event) {
			return createEventInfo(event);
		}
		throw new ErrorResponse(404, "Event not found");
	}

	async createEvent(params: CreateEventParams): Promise<EventInfo> {
		const event = new EventDomain(
			"",
			params.title,
			params.description,
			params.start_date,
			params.end_date,
			params.location,
			params.organizer,
			params.attendees || [],
			params.active,
		);
		await this._eventRepo.save(event);

		await this._eventPub.publishtCancelEvent({
			event_id: "create",
		});

		return createEventInfo(event);
	}

	async cancelEvent(p: CancelEventRequest) {
		const rs = await this._eventRepo.findById(p.event_id);
		if (rs) {
			const event = rs as EventDomain;
			if (event.cancelEvent(p.user_id)) {
				await this._eventRepo.save(event);
			}
			await this._eventPub.publishtCancelEvent({
				event_id: p.event_id,
			});
		}
		throw new ErrorResponse(404, "Event not found");
	}

	async updateEvent(p: UpdateEventRequest) {
		const rs = await this._eventRepo.findById(p.event_id);
		if (rs) {
			const event = rs as EventDomain;
			event.updateDetails(p.user_id, {
				title: p.params.title,
				description: p.params.description,
				start_date: p.params.start_date,
				end_date: p.params.end_date,
				location: p.params.location,
				organizer: p.params.organizer,
			});
			await this._eventRepo.save(event);
			await this._eventPub.publishUpdateEvent({
				event_id: p.event_id,
			})
		}
		throw new ErrorResponse(404, "Event not found");
	}
	async addAttendee(p: { event_id: string; user_id: string }) {
		const rs = await this._eventRepo.findById(p.event_id);
		if (rs) {
			const event = rs as EventDomain;
			event.addAttendee(p.user_id);
			await this._eventRepo.save(event);
		}
		throw new ErrorResponse(404, "Event not found");
	}

	async removeAttendee(p: { event_id: string; user_id: string }) {
		const rs = await this._eventRepo.findById(p.event_id);
		if (rs) {
			const event = rs as EventDomain;
			event.removeAttendee(p.user_id);
			await this._eventRepo.save(event);
		}
		throw new ErrorResponse(404, "Event not found");
	}

	async checkAttendee(p: { event_id: string; user_id: string }) {
		const rs = await this._eventRepo.findById(p.event_id);
		if (rs) {
			const event = rs as EventDomain;
			return event.checkAttendee(p.user_id);
		}
		return false;
	}
	async listEvents(p: {
		search?: string,
		offset?: number,
		limit?: number
	}) {
		const rs = await this._eventRepo.findAll(p);
		return {
			events: rs.events.map(createEventInfo),
			total: rs.total
		}
	}
}
