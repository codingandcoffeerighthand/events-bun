export class User {
	private id: string;
	name: string;
	email: string;
	private hashed_password: string;
	private is_active: boolean;
	constructor(name: string, email: string) {
		this.id = "";
		this.hashed_password = "";
		this.name = name;
		this.email = email;
		this.is_active = true;
	}
	public async setPassword(password: string) {
		this.hashed_password = await Bun.password.hash(password);
	}
	public async comparePassword(password: string) {
		return await Bun.password.verify(this.hashed_password, password);
	}
	public setId(id: string) {
		this.id = id;
	}
	public getId() {
		return this.id;
	}
	public setHashedPassword(password: string) {
		this.hashed_password = password;
	}
	public getHashedPassword() {
		return this.hashed_password;
	}
	public isActive() {
		return this.is_active;
	}
	public disable() {
		this.is_active = false;
	}
	public enable() {
		this.is_active = true;
	}
}
