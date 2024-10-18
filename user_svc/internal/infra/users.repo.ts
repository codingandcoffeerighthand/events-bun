import { Pool } from "pg";
import type { User } from "../domain/user";
import type { IUserRepository } from "./db.interface";
import type { DBConfig } from "../config/config";
import {
	createUser,
	getList,
	getListUserByIDs,
	getUser,
	getUserByEmail,
	getUserByName,
	searchUsers,
	updateUser,
} from "./db/user";
export class UsersRepo implements IUserRepository {
	private pool: Pool;
	private constructor(cfg: DBConfig) {
		this.pool = new Pool({
			host: cfg.host,
			port: cfg.port,
			user: cfg.user,
			password: cfg.password,
			database: cfg.database,
			ssl: cfg.ssl,
		});
	}
	static create(cfg: DBConfig): [UsersRepo, () => void] {
		const repo = new UsersRepo(cfg);
		return [repo, () => repo.pool.end()];
	}
	async get(id: string): Promise<User> {
		try {
			const rs = await getUser(this.pool, id);
			return rs;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
	async create(user: User): Promise<User> {
		const userId = await createUser(
			this.pool,
			user.name,
			user.email,
			user.getHashedPassword(),
			user.isActive(),
		);
		const rs = getUser(this.pool, userId);
		return rs;
	}
	async update(user: User): Promise<User> {
		await updateUser(
			this.pool,
			user.getId(),
			user.name,
			user.email,
			user.getHashedPassword(),
			user.isActive(),
		);
		return await getUser(this.pool, user.getId());
	}
	async delete(id: string): Promise<void> {
		const user = await getUser(this.pool, id);
		user.disable();
		await this.update(user);
	}
	getUserByEmail(email: string): Promise<User> {
		return getUserByEmail(this.pool, email);
	}
	getUserByName(name: string): Promise<User> {
		return getUserByName(this.pool, name);
	}
	getListUserByIDs(ids: string[]): Promise<User[]> {
		return getListUserByIDs(this.pool, ids);
	}
	getList(offset: number, limit: number): Promise<[User[], number]> {
		return getList(this.pool, offset, limit);
	}
	searchUsers(
		query: { name?: string; email?: string },
		offset: number,
		limit: number,
	): Promise<[User[], number]> {
		return searchUsers(this.pool, query, offset, limit);
	}
}
