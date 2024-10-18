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

export function createUser(req: CreateUserReuqest): User {
	const user = new User(req.name, req.email);
	user.setPassword(req.password);
	return user;
}

export type CreateUserResponse = {
	id: string;
	name: string;
	email: string;
};

export function userInfoResponse(user: User): CreateUserResponse {
	return {
		id: user.getId(),
		name: user.name,
		email: user.email,
	};
}
