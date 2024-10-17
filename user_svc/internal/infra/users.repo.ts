import { Pool } from "pg";
import type { User } from "../domain/user";
import type { IUserRepository } from "./db.interface";
import type { DBConfig } from "../config/config";
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
	get(id: string): Promise<User> {
		throw new Error("Method not implemented.");
	}
	create(user: User): Promise<User> {
		throw new Error("Method not implemented.");
	}
	update(user: User): Promise<User> {
		throw new Error("Method not implemented.");
	}
	delete(id: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
	getUserByEmail(email: string): Promise<User> {
		throw new Error("Method not implemented.");
	}
	getUserByName(name: string): Promise<User> {
		throw new Error("Method not implemented.");
	}
	getListUserByIDs(ids: string[]): Promise<User[]> {
		throw new Error("Method not implemented.");
	}
	getList(offset: number, limit: number): Promise<User[]> {
		throw new Error("Method not implemented.");
	}
	searchUsers(
		query: { name?: string; email?: string },
		offset: number,
		limit: number,
	): Promise<User[]> {
		throw new Error("Method not implemented.");
	}
}
