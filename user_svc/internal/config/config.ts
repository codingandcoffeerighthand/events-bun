export interface IConfig {
	port: number;
	db: DBConfig;
}

export interface DBConfig {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
	ssl: boolean;
}
