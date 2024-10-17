import type { Client } from "pg";

async function readUpdateFile(
	path = "./db/migrations/up.sql",
): Promise<string> {
	try {
		return await Bun.file(path).text();
	} catch (error) {
		throw new Error(`Can't read up migration database file : ${path}`);
	}
}

export async function migrateDB(db: Client, filePath: string): Promise<void> {
	const sql = await readUpdateFile(filePath);
	await db.query(sql);
}
