import {
	status,
	type handleUnaryCall,
	type sendUnaryData,
	type Server,
	type ServerUnaryCall,
} from "@grpc/grpc-js";
import type * as proto from "@shared/proto/gen/event_service";
import type { EventUc } from "../uc/events/uc";
import { mapCreateEventParams, mapEventInfo, mapUpdateEventParams } from "./map";
export class EventService {
	constructor(private readonly _eventUc: EventUc) { }
	async getEvent(
		call: ServerUnaryCall<proto.GetEventRequest, proto.GetEventResponse>,
		callback: sendUnaryData<proto.GetEventResponse>,
	) {
		const req = call.request;
		const event = await this._eventUc.getEvent(req.id);
		callback(null, { event: mapEventInfo(event) });
	}
	async createEvent(
		call: ServerUnaryCall<proto.CreateEventRequest, proto.CreateEventResponse>,
		callback: sendUnaryData<proto.CreateEventResponse>,
	) {
		try {
			const req = call.request;
			const par = mapCreateEventParams(req);
			const event = await this._eventUc.createEvent(par);
			callback(null, { event: mapEventInfo(event) });
		} catch (err) {
			console.error(err);
			callback({ code: status.INTERNAL }, null);
		}
	}

	async updateEvent(
		call: ServerUnaryCall<proto.UpdateEventRequest, proto.UpdateEventResponse>,
		callback: sendUnaryData<proto.UpdateEventResponse>,
	) {
		try {
			const req = call.request;
			const par = mapUpdateEventParams(req);
			await this._eventUc.updateEvent(par);
			callback(null, { success: true });
		} catch (err) {
			callback({ code: status.INTERNAL }, { success: false });
		}
	}

	async addAttendee(
		call: ServerUnaryCall<proto.AddAttendeeRequest, proto.AddAttendeeResponse>,
		callback: sendUnaryData<proto.AddAttendeeResponse>,
	) {
		try {
			const req = call.request;
			await this._eventUc.addAttendee({
				event_id: req.eventId,
				user_id: req.userId,
			});
			callback(null, { success: true });
		} catch (err) {
			callback({ code: status.INTERNAL }, { success: false });
		}
	}

	async removeAttendee(
		call: ServerUnaryCall<proto.RemoveAttendeeRequest, proto.RemoveAttendeeResponse>,
		callback: sendUnaryData<proto.RemoveAttendeeResponse>,
	) {
		try {
			const req = call.request;
			await this._eventUc.removeAttendee({
				event_id: req.eventId,
				user_id: req.userId,
			});
			callback(null, { success: true });
		} catch (err) {
			callback({ code: status.INTERNAL }, { success: false });
		}
	}
	async checkAttendee(
		call: ServerUnaryCall<proto.CheckAttendeeRequest, proto.CheckAttendeeResponse>,
		callback: sendUnaryData<proto.CheckAttendeeResponse>,
	) {
		try {
			const req = call.request;
			const result = await this._eventUc.checkAttendee({
				event_id: req.eventId,
				user_id: req.userId,
			});
			callback(null, { success: result });
		} catch (err) {
			callback({ code: status.INTERNAL }, { success: false });
		}
	}

	async cancelEvent(
		call: ServerUnaryCall<proto.CancelEventRequest, proto.CancelEventResponse>,
		callback: sendUnaryData<proto.CancelEventResponse>,
	) {
		try {
			const req = call.request;
			await this._eventUc.cancelEvent({
				event_id: req.id,
				user_id: req.userId,
			});
			callback(null, { success: true });
		} catch (err) {
			callback({ code: status.INTERNAL }, { success: false });
		}
	}
	async listEvents(
		call: ServerUnaryCall<proto.ListEventsRequest, proto.ListEventsResponse>,
		callback: sendUnaryData<proto.ListEventsResponse>,
	) {
		try {
			const req = call.request;
			const events = await this._eventUc.listEvents({
				search: req.search,
				offset: req.offset,
				limit: req.limit,
			});
			const eventsList = events.events.map((e) => mapEventInfo(e));
			callback(null, { events: eventsList, total: events.total });
		} catch (err) {
			callback({ code: status.INTERNAL }, null);
		}
	}

	service: proto.EventServiceServer = {
		getEvent: this.getEvent.bind(this),
		createEvent: this.createEvent.bind(this),
		updateEvent: this.updateEvent,
		addAttendee: this.addAttendee,
		removeAttendee: this.removeAttendee,
		checkAttendee: this.checkAttendee,
		cancelEvent: this.cancelEvent,
		listEvents: this.listEvents,
	};
}
