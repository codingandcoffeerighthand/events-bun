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
	public setPassword(password: string) {
		this.hashed_password = Bun.password.hashSync(password);
	}
	public comparePassword(password: string) {
		return Bun.password.verifySync(this.hashed_password, password);
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
