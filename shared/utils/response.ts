import type { Response } from "express";
export function successResponse<T>(
	res: Response,
	data: T,
	status = 200,
	message: string | null = null,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	metadata: any = null,
) {
	return res.status(status).json({
		success: true,
		data,
		message,
		metadata,
	});
}

export function errorResponse(
	res: Response,
	status = 400,
	message: string | null = null,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	details: any = null,
) {
	return res.status(status).json({
		success: false,
		message,
		details,
	});
}
