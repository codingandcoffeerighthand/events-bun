import type { Pool } from "pg";
import { User } from "../../domain/user";

export async function getUser(db: Pool, id: string): Promise<User> {
	const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
	const user = new User(result.rows[0].name, result.rows[0].email);
	user.setHashedPassword(result.rows[0].hashed_password);
	user.setId(result.rows[0].id);
	return user;
}
export async function createUser(
	db: Pool,
	name: string,
	email: string,
	hasshedPassword: string,
	is_active: boolean,
): Promise<string> {
	const rs = await db.query(
		"INSERT INTO users (name, email, hashed_password, is_active) VALUES ($1, $2, $3, $4) RETURNING id",
		[name, email, hasshedPassword, is_active],
	);
	return rs.rows[0].id;
}

export async function updateUser(
	db: Pool,
	id: string,
	name: string,
	email: string,
	hasshedPassword: string,
	is_active: boolean,
): Promise<void> {
	await db.query(
		"UPDATE users SET name = $1, email = $2, hashed_password = $3, is_active = $4 WHERE id = $5",
		[name, email, hasshedPassword, is_active, id],
	);
}

export async function getUserByEmail(db: Pool, email: string): Promise<User> {
	const result = await db.query("SELECT * FROM users WHERE email = $1", [
		email,
	]);
	const user = new User(result.rows[0].id, result.rows[0].name);
	user.setHashedPassword(result.rows[0].hashed_password);
	user.setId(result.rows[0].id);
	return user;
}

export async function getUserByName(db: Pool, name: string): Promise<User> {
	const result = await db.query("SELECT * FROM users WHERE name = $1", [name]);
	const user = new User(result.rows[0].id, result.rows[0].name);
	user.setHashedPassword(result.rows[0].hashed_password);
	user.setId(result.rows[0].id);
	return user;
}

export async function getListUserByIDs(
	db: Pool,
	ids: string[],
): Promise<User[]> {
	const result = await db.query("SELECT * FROM users WHERE id in ($1)", [ids]);
	return result.rows.map((row) => {
		const user = new User(row.id, row.name);
		user.setHashedPassword(row.hashed_password);
		user.setId(row.id);
		return user;
	});
}

export async function getList(
	db: Pool,
	offset: number,
	limit: number,
): Promise<[User[], number]> {
	const count = Number.parseInt(
		(await db.query("SELECT COUNT(id) FROM users")).rows[0].count,
	);
	const result = await db.query("SELECT * FROM users LIMIT $1 OFFSET $2", [
		limit,
		offset,
	]);
	return [
		result.rows.map((row) => {
			const user = new User(row.id, row.name);
			user.setHashedPassword(row.hashed_password);
			user.setId(row.id);
			return user;
		}),
		count,
	];
}

export async function searchUsers(
	db: Pool,
	query: {
		name?: string;
		email?: string;
	},
	offset: number,
	limit: number,
	ids?: string[],
): Promise<[User[], number]> {
	let queryString = "SELECT * FROM users WHERE name like %$1% OR email = %$2%";
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let ps: any[] = [query.name, query.email];
	if (ids) {
		queryString = `${query} AND id in ($3)`;
		ps = [query.name, query.email, ids];
	}
	const result = await db.query(
		`${queryString} LIMIT $${ps.length} OFFSET ${ps.length + 1}`,
		[...ps, limit, offset],
	);
	const count = Number.parseInt(
		(await db.query(queryString, ps)).rows[0].count,
	);
	return [
		result.rows.map((row) => {
			const user = new User(row.id, row.name);
			user.setHashedPassword(row.hashed_password);
			user.setId(row.id);
			return user;
		}),
		count,
	];
}
