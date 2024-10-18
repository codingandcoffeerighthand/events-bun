import type { IUserRepository } from "../../infra/db.interface";
import {
	createUser,
	userInfoResponse,
	type CreateUserResponse,
	type CreateUserReuqest,
} from "./crateUser";

export class UserUC {
	public readonly _userrepo: IUserRepository;
	constructor(userrepo: IUserRepository) {
		this._userrepo = userrepo;
	}

	public async getUser(id: string) {
		const user = await this._userrepo.get(id);
		return userInfoResponse(user);
	}

	public async createUser(req: CreateUserReuqest): Promise<CreateUserResponse> {
		const user = createUser(req);
		const rs = await this._userrepo.create(user);
		return userInfoResponse(rs);
	}
}
