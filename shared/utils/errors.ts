export interface IErrorResponse extends Error {
	status: number;
}
export class ErrorResponse extends Error implements IErrorResponse {
	status: number;
	constructor(status: number, message: string, err: Error = new Error()) {
		super(message, { cause: err });
		this.status = status;
	}
}

export function isErrorResponse(err: unknown): err is IErrorResponse {
	return (
		err instanceof Error &&
		"status" in err &&
		typeof (err as IErrorResponse).status === "number"
	);
}
