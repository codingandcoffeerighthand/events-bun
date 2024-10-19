import type * as proto from "@shared/proto/gen/event_service";
import type * as uc from "../uc/events/eventParams";

export function mapEventInfo(event: uc.EventInfo): proto.EventInfo {
	return {
		id: event.id,
		title: event.title,
		description: event.description,
		startDate: event.start_date.toISOString(),
		endDate: event.end_date.toISOString(),
		location: event.location,
		organizer: event.organizer,
		attendees: event.attendees,
		active: event.active,
	};
}
export function mapCreateEventParams(
	event: proto.CreateEventRequest,
): uc.CreateEventParams {
	return {
		title: event.title,
		description: event.description,
		start_date: new Date(event.startDate),
		end_date: new Date(event.endDate),
		location: event.location,
		organizer: event.organizer,
		attendees: event.attendees,
		active: event.active,
	};
}

export function mapUpdateEventParams(
	event: proto.UpdateEventRequest,
): uc.UpdateEventRequest {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let param: any = {
			title: event.title,
			description: event.description,
			location: event.location,
		};
	if(event.startDate) {
		param = {
			...param,
			start_date: new Date(event.startDate),
		}
	}
	if (event.endDate) {
		param = {
			...param,
			end_date: new Date(event.endDate),
		}
	}
	return {
		event_id: event.id,
		user_id: event.userId,
		params: param,
	};
}
