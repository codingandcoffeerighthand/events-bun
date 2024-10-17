import { getFlag } from "@shared/utils/getFlag";
import { getConfigs } from "@shared/utils/configs";
import type { IConfig } from "../internal/config/config";
import { App } from "@shared/server";
import { migrateDB } from "../internal/infra/db/migrate_db";
import { Client } from "pg";
async function main() {
	const config = await getConfigs<IConfig>(getFlag("-c"));

	// check migrate db
	{
		const migratePath = getFlag("-db");
		if (migratePath) {
			let cleanup: () => void = () => {};
			try {
				const client = new Client({
					user: config.db.user,
					host: config.db.host,
					database: config.db.database,
					password: config.db.password,
					port: config.db.port,
					ssl: config.db.ssl,
				});
				client.connect();
				const result = await client.query("SELECT 1");
				if (result.rows.length === 0) {
					console.error("db not found");
					return;
				}
				console.info("db connected");
				cleanup = () => client.end();
				await migrateDB(client, migratePath);
				console.info("db migrated");
			} catch (error) {
				console.error("db migrate error", error);
				throw error;
			} finally {
				cleanup();
			}
			return;
		}
	}
	const app = new App();
	app.addRouter(require("../internal/api/hello").default);
	app.start(config.port);
}

try {
	await main();
} catch (error) {
	// biome-ignore lint/complexity/noUselessCatch: <explanation>
	throw error;
}
