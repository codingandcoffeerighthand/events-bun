export interface IConfig {
	port: number;
	db: DBConfig;
	jwt: JWTConfig;
}

export interface DBConfig {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
	ssl: boolean;
}

export interface JWTConfig {
	secret: string;
	accessTokenTTL: string;
	refreshTokenTTL: string;
}
