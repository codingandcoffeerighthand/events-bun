export interface Pub {
	publish(topic: string, data: unknown): void;
}

export interface Sub {
	subrscribe(topic: string, callback: (data: unknown) => void): void;
}
