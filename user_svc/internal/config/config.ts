export interface IConfig {
	port: number;
	db: DBConfig;
	jwt: JWTConfig;
	events: EventConfig;
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


export interface EventConfig {
	url: string;
}