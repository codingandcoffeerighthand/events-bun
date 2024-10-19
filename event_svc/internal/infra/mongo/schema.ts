import { Schema, type Document, model, type Types } from "mongoose";
import { EventDomain } from "../../domain/events";
interface EventDomainDocument extends Document {
	_id: Types.ObjectId;
	title: string;
	description: string;
	start_date: Date;
	end_date: Date;
	location: string;
	active: boolean;
	organizer: string;
	attendees: string[];
}

const EventDomainSchema = new Schema<EventDomainDocument>(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		start_date: { type: Date, required: true },
		end_date: { type: Date, required: true },
		location: { type: String, required: true },
		organizer: { type: String, required: true },
		active: { type: Boolean, default: true },
		attendees: [{ type: String }],
	},
	{
		timestamps: true,
	},
);

EventDomainSchema.index({ title: "text", description: "text" });

export const EventDomainModel = model<EventDomainDocument>(
	"eventsDomain",
	EventDomainSchema,
);

export function mapToEventDomain(doc: EventDomainDocument): EventDomain {
	return new EventDomain(
		doc._id.toString(),
		doc.title,
		doc.description,
		doc.start_date,
		doc.end_date,
		doc.location,
		doc.organizer,
		doc.attendees,
		doc.active,
	);
}
