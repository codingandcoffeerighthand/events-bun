import { Router } from "express";
import type { EventClient } from "../infra/events_client/client";
import type { UserUC } from "../uc/user/user.uc";
import asyncHandler from "@shared/utils/asyncHandler";
import type { ListEventsRequest } from "@shared/proto/gen/event_service";
import { successResponse } from "@shared/utils/response";

export class EventAPI {
  constructor(
    private readonly _eventClietn: EventClient,
    private readonly _uc: UserUC,
  ) { }

  api() {
    const router = Router();

    // no auth
    router.post("/", asyncHandler(async (req, res) => {
      const { limit, offset, search } = req.query;
      const param = {
        limit: Number(limit),
        offset: Number(offset),
        search: search as string,
      }
      const rs = await this._eventClietn.listEvents(param);
      successResponse(res, rs, 200);
    }));

    router.get("/:id/attendees/:attendeeId", asyncHandler(async (req, res) => {
      const id = req.params.id;
      const attendeeId = req.params.attendeeId;
      const p = { userId: attendeeId, eventId: id };
      const rs = await this._eventClietn.checkAttendee(p);
      successResponse(res, rs, 200);
    }));

    router.get("/:id", asyncHandler(async (req, res) => {
      const id = req.params.id;
      const p = { id };
      const rs = await this._eventClietn.getEvent(p);
      successResponse(res, rs, 200);
    }));


    // auth
    router.use(this._uc.authMiddleware());

    router.post("/:id/attendees", asyncHandler(async (req, res) => {
      const userId = req.userId ?? "";
      const p = {
        eventId: req.params.id,
        userId
      }
      const rs = await this._eventClietn.addAttendee(p);
      successResponse(res, rs, 200);
    }))

    router.delete("/:id/attendees", asyncHandler(async (req, res) => {
      const userId = req.userId ?? "";
      const p = {
        eventId: req.params.id,
        userId
      }
      const rs = await this._eventClietn.removeAttendee(p);
      successResponse(res, rs, 200);
    }))

    router.delete("/:id", asyncHandler(async (req, res) => {
      const id = req.params.id;
      const p = {
        id,
        userId: req.userId ?? "",
      };
      const rs = await this._eventClietn.cancelEvent(p);
      successResponse(res, rs, 200);
    }))

    router.post("/", asyncHandler(async (req, res) => {
      const userId = req.userId ?? "";
      const attendees: string[] = [];
      const p = {
        title: req.body.title,
        description: req.body.description,
        startDate: req.body.start_date,
        endDate: req.body.end_date,
        location: req.body.location,
        organizer: userId,
        attendees,
        active: true,
      }
      const rs = await this._eventClietn.createEvent(p);
      successResponse(res, rs, 200);
    }))

    router.put("/:id", asyncHandler(async (req, res) => {
      const userId = req.userId ?? "";
      const p = {
        id: req.params.id,
        title: req.body.title,
        description: req.body.description,
        startDate: req.body.start_date,
        endDate: req.body.end_date,
        location: req.body.location,
        organizer: userId,
        active: true,
        userId
      }
      const rs = await this._eventClietn.updateEvent(p);
      successResponse(res, rs, 200);
    }))



    return Router().use("/events", router);
  }
}