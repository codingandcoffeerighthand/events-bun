import { User } from "../../domain/user";

export type CreateUserReuqest = {
	name: string;
	email: string;
	password: string;
};

export function validateCreateUserRequest(req: CreateUserReuqest): boolean {
	if (!req.name || !req.email || !req.password) {
		return false;
	}
	return true;
}

export async function createUser(req: CreateUserReuqest): Promise<User> {
	const user = new User(req.name, req.email);
	await user.setPassword(req.password);
	return user;
}

export type UserInfoResponse = {
	id: string;
	name: string;
	email: string;
};

export function userInfoResponse(user: User): UserInfoResponse {
	return {
		id: user.getId(),
		name: user.name,
		email: user.email,
	};
}

export type ListUserRequest = {
	name?: string;
	email?: string;
	ids?: string[];
	offset: number;
	limit: number;
};

export function validateListUserRequest(req: ListUserRequest): boolean {
	if (req.offset < 0 || req.limit < 0) {
		return false;
	}
	return true;
}

export type ListUserResponse = {
	users: UserInfoResponse[];
	metadata: {
		total: number;
	};
};

export type LoginRequest = {
	email: string;
	password: string;
};

export type LoginResponse = {
	user: UserInfoResponse;
	accessToken: string;
	refreshToken: string;
};

export type ChangePasswordRequest = {
	email: string;
	oldpassword: string;
	newpassword: string;
};
