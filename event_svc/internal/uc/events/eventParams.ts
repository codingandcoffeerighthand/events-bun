import type { EventDomain } from "../../domain/events";

export type CreateEventParams = {
	title: string;
	description: string;
	start_date: Date;
	end_date: Date;
	location: string;
	organizer: string;
	attendees?: string[];
	active?: boolean;
};

export function validateCreateEventParams(params: CreateEventParams) {
	if (!params.title) {
		throw new Error("Missing title");
	}
	if (!params.description) {
		throw new Error("Missing description");
	}
	if (!params.start_date) {
		throw new Error("Missing start_date");
	}
	if (!params.end_date) {
		throw new Error("Missing end_date");
	}
	if (!params.location) {
		throw new Error("Missing location");
	}
	if (!params.organizer) {
		throw new Error("Missing organizer");
	}
}

export type EventInfo = {
	id: string;
	title: string;
	description: string;
	start_date: Date;
	end_date: Date;
	location: string;
	organizer: string;
	attendees: string[];
	active: boolean;
};
export function createEventInfo(event: EventDomain): EventInfo {
	return {
		id: event.id,
		title: event.title,
		description: event.description,
		start_date: event.start_date,
		end_date: event.end_date,
		location: event.location,
		organizer: event.organizer,
		attendees: event.attendees,
		active: event.active,
	};
}

export type CancelEventRequest = {
	event_id: string;
	user_id: string;
};

export type UpdateEventRequest = {
	event_id: string;
	user_id: string;
	params: Partial<EventDomain>;
};
