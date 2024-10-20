import { credentials } from "@grpc/grpc-js";
import { type AddAttendeeRequest, type AddAttendeeResponse, type CancelEventRequest, type CancelEventResponse, type CheckAttendeeRequest, type CheckAttendeeResponse, type CreateEventRequest, type CreateEventResponse, EventServiceClient, type GetEventRequest, type GetEventResponse, type ListEventsRequest, type ListEventsResponse, type RemoveAttendeeRequest, type RemoveAttendeeResponse, type UpdateEventRequest, type UpdateEventResponse } from "@shared/proto/gen/event_service";

export class EventClient {
  client: EventServiceClient;
  constructor(url: string) {
    this.client = new EventServiceClient(
      url,
      credentials.createInsecure(),
    )
  }
  connect() {
    this.client.waitForReady(4000, err => {
      if (err) {
        console.error(`Failed to connect to events service GRPC ${err}`);
      }
      console.log("Connected to events service GRPC");
    })
  }
  createEvent(params: CreateEventRequest) {
    return new Promise<CreateEventResponse>((res, rej) => {
      this.client.createEvent(params, (err, response) => {
        if (err) {
          rej(err);
        } else {
          res(response);
        }
      });
    });
  }

  getEvent(id: GetEventRequest) {
    return new Promise<GetEventResponse>((res, rej) => {
      this.client.getEvent(id, (err, response) => {
        if (err) {
          rej(err);
        } else {
          res(response);
        }
      });
    });
  }

  updateEvent(req: UpdateEventRequest) {
    return new Promise<UpdateEventResponse>((res, rej) => {
      this.client.updateEvent(req, (err, response) => {
        if (err) {
          rej(err);
        } else {
          res(response);
        }
      });
    });
  }


  listEvents(req: ListEventsRequest) {
    return new Promise<ListEventsResponse>((res, rej) => {
      this.client.listEvents(req, (err, response) => {
        if (err) {
          rej(err);
        } else {
          res(response);
        }
      });
    });
  }

  addAttendee(params: AddAttendeeRequest) {
    return new Promise<AddAttendeeResponse>((res, rej) => {
      this.client.addAttendee(params, (err, response) => {
        if (err) {
          rej(err);
        } else {
          res(response);
        }
      });
    });
  }

  removeAttendee(params: RemoveAttendeeRequest) {
    return new Promise<RemoveAttendeeResponse>((res, rej) => {
      this.client.removeAttendee(params, (err, response) => {
        if (err) {
          rej(err);
        } else {
          res(response);
        }
      });
    });
  }
  cancelEvent(params: CancelEventRequest) {
    return new Promise<CancelEventResponse>((res, rej) => {
      this.client.cancelEvent(params, (err, response) => {
        if (err) {
          rej(err);
        } else {
          res(response);
        }
      });
    });
  }
  checkAttendee(params: CheckAttendeeRequest) {
    return new Promise<CheckAttendeeResponse>((res, rej) => {
      this.client.checkAttendee(params, (err, response) => {
        if (err) {
          rej(err);
        } else {
          res(response);
        }
      });
    });
  }
}