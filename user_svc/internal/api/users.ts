import asyncHandler from "@shared/utils/asyncHandler";
import type { UserUC } from "../uc/user/user.uc";
import { Router } from "express";
import {
	validateCreateUserRequest,
	type CreateUserReuqest,
} from "../uc/user/crateUser";
import { errorResponse, successResponse } from "@shared/utils/response";

export class UserAPi {
	private readonly _uc: UserUC;
	constructor(uc: UserUC) {
		this._uc = uc;
	}

	api() {
		const router = Router();

		router.get("/:id", async (req, res) => {
			const user = await this._uc.getUser(req.params.id);
			res.json(user);
		});

		router.post(
			"/",
			asyncHandler(async (req, res) => {
				const createUserRequest = req.body as CreateUserReuqest;
				if (!validateCreateUserRequest(createUserRequest)) {
					errorResponse(res, 400, "bad request");
					return;
				}
				const rs = await this._uc.createUser(createUserRequest);
				successResponse(res, rs, 201);
			}),
		);

		return Router().use("/users", router);
	}
}
