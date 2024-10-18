import { sign, verify, type JwtPayload } from "jsonwebtoken";
import type { JWTConfig } from "../../config/config";
import type { User } from "../../domain/user";
import type { IUserRepository } from "../../infra/db.interface";
import {
	createUser,
	userInfoResponse,
	type UserInfoResponse,
	type CreateUserReuqest,
	type ListUserRequest,
	type ListUserResponse,
	type LoginResponse,
	type LoginRequest,
	type ChangePasswordRequest,
} from "./user_params";
import { ErrorResponse } from "@shared/utils/errors";
import type { NextFunction, RequestHandler, Response, Request } from "express";
import asyncHandler from "@shared/utils/asyncHandler";
import { errorResponse } from "@shared/utils/response";

export class UserUC {
	private readonly _userrepo: IUserRepository;
	private readonly _jwtConfig: JWTConfig;
	constructor(userrepo: IUserRepository, jwtConfig: JWTConfig) {
		this._userrepo = userrepo;
		this._jwtConfig = jwtConfig;
	}

	public async getUser(id: string) {
		const user = await this._userrepo.get(id);
		return userInfoResponse(user);
	}

	public async createUser(req: CreateUserReuqest): Promise<UserInfoResponse> {
		const user = await createUser(req);
		const rs = await this._userrepo.create(user);
		return userInfoResponse(rs);
	}

	public async listUser(req: ListUserRequest): Promise<ListUserResponse> {
		const rs = await this._userrepo.searchUsers(
			{
				name: req.name,
				email: req.email,
			},
			req.offset,
			req.limit,
		);
		const r: ListUserResponse = {
			users: [],
			metadata: {
				total: 0,
			},
		};
		r.users = rs[0].map((user) => userInfoResponse(user));
		r.metadata.total = rs[1];
		return r;
	}
	public generateAccessToken(user: User) {
		return sign(
			{ id: user.getId(), email: user.email, name: user.name },
			this._jwtConfig.secret,
			{
				expiresIn: this._jwtConfig.accessTokenTTL,
			},
		);
	}

	public async login(req: LoginRequest): Promise<LoginResponse> {
		const user = await this._userrepo.getUserByEmail(req.email);
		const checkpass = await user.comparePassword(req.password);
		if (checkpass) {
			return {
				user: userInfoResponse(user),
				accessToken: this.generateAccessToken(user),
				refreshToken: this.generateRefreshToken(user),
			};
		}
		throw new ErrorResponse(401, "invalid credentials");
	}

	public generateRefreshToken(user: User) {
		return sign(
			{ id: user.getId(), email: user.email, name: user.name },
			this._jwtConfig.secret,
			{
				expiresIn: this._jwtConfig.refreshTokenTTL,
			},
		);
	}
	public verifyRefreshToken(token: string) {
		const payload = verify(token, this._jwtConfig.secret) as JwtPayload;
		return payload.id as string;
	}

	public refreshAccessToken(refreshToken: string) {
		const payload = verify(refreshToken, this._jwtConfig.secret) as JwtPayload;
		return sign(
			{ id: payload.id, email: payload.email, name: payload.name },
			this._jwtConfig.secret,
			{
				expiresIn: this._jwtConfig.accessTokenTTL,
			},
		);
	}

	public authMiddleware(): RequestHandler {
		return asyncHandler(
			async (req: Request, res: Response, next: NextFunction) => {
				const token = req.headers?.authorization || "";
				if (!token) {
					errorResponse(res, 401, "unauthorized");
				}
				const payload = verify(token, this._jwtConfig.secret) as JwtPayload;
				res.send(payload);
				req.userId = payload.id;
				return next();
			},
		);
	}
	public async changePassword(req: ChangePasswordRequest): Promise<boolean> {
		const user = await this._userrepo.getUserByEmail(req.email);
		const checkpass = await user.comparePassword(req.oldpassword);
	}
}
