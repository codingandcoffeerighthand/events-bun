import type { User } from "../domain/user";
export interface IUserRepository {
	get(id: string): Promise<User>;
	create(user: User): Promise<User>;
	update(user: User): Promise<User>;
	delete(id: string): Promise<void>;

	getUserByEmail(email: string): Promise<User>;
	getUserByName(name: string): Promise<User>;
	getListUserByIDs(ids: string[]): Promise<User[]>;
	getList(offset: number, limit: number): Promise<[User[], number]>;

	searchUsers(
		query: {
			name?: string;
			email?: string;
		},
		offset: number,
		limit: number,
		ids?: string[],
	): Promise<[User[], number]>;
}
