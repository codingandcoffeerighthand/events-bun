import asyncHandler from "@shared/utils/asyncHandler";
import type { UserUC } from "../uc/user/user.uc";
import { Router } from "express";
import {
	validateCreateUserRequest,
	validateListUserRequest,
	type ChangePasswordRequest,
	type CreateUserReuqest,
	type ListUserRequest,
	type LoginRequest,
} from "../uc/user/user_params";
import { errorResponse, successResponse } from "@shared/utils/response";

export class UserAPi {
	private readonly _uc: UserUC;
	constructor(uc: UserUC) {
		this._uc = uc;
	}

	api() {
		const router = Router();
		router.get(
			"/",
			asyncHandler(async (req, res) => {
				const listUserRequest = req.query as unknown as ListUserRequest;
				if (!validateListUserRequest(listUserRequest)) {
					errorResponse(res, 400, "bad request");
					return;
				}
				const rs = await this._uc.listUser(listUserRequest);
				successResponse(res, rs.users, 200, null, rs.metadata);
			}),
		);

		router.get(
			"/info",
			this._uc.authMiddleware(),
			asyncHandler(async (req, res) => {
				const userId = req.userId as string;
				const user = await this._uc.getUser(userId);
				successResponse(res, user, 200);
			}),
		);

		router.get("/:id", async (req, res) => {
			const id = req.params.id as string;
			try {
				const user = await this._uc.getUser(id);
				res.json(user);
			} catch (error) {
				errorResponse(res, 404, "not found");
			}
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

		router.post("/refresh", (req, res) => {
			const refreshToken = req.body.refreshToken as string;
			const rs = this._uc.refreshAccessToken(refreshToken);
			successResponse(res, rs, 200);
		});

		router.post(
			"/login",
			asyncHandler(async (req, res) => {
				const loginRequest = req.body as LoginRequest;
				const rs = await this._uc.login(loginRequest);
				successResponse(res, rs, 200);
			}),
		);

		router.post(
			"/change-password",
			asyncHandler(async (req, res) => {
				const refreshToken = req.body as ChangePasswordRequest;
				const rs = await this._uc.changePassword(refreshToken);
				successResponse(res, rs, 200);
			}),
		);

		return Router().use("/users", router);
	}
}
