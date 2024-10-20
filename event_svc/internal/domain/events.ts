export class EventDomain {
	constructor(
		public id: string,
		public title: string,
		public description: string,
		public start_date: Date,
		public end_date: Date,
		public location: string,
		public organizer: string,
		public attendees: string[],
		public active = true,
	) { }

	addAttendee(attendee: string) {
		this.attendees.push(attendee);
	}
	removeAttendee(attendee: string) {
		this.attendees = this.attendees.filter((a) => a !== attendee);
	}
	checkOrganizer(organizerID: string) {
		return this.organizer === organizerID;
	}
	checkAttendee(attendeeID: string) {
		return this.attendees.includes(attendeeID);
	}
	updateDetails(
		organizerID: string,
		data: {
			title?: string;
			description?: string;
			start_date?: Date;
			end_date?: Date;
			location?: string;
			organizer?: string;
		},
	) {
		if (!this.checkOrganizer(organizerID)) {
			return;
		}
		this.title = data.title ? data.title : this.title;
		this.description = data.description ? data.description : this.description;
		this.start_date = data.start_date ? data.start_date : this.start_date;
		this.end_date = data.end_date ? data.end_date : this.end_date;
		this.location = data.location ? data.location : this.location;
		this.organizer = data.organizer ? data.organizer : this.organizer;
	}
	cancelEvent(organizerID: string): boolean {
		if (!this.checkOrganizer(organizerID)) {
			return false;
		}
		this.active = false;
		return true;
	}
}
