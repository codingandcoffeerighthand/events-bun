import { ErrorResponse, isErrorResponse } from "@shared/utils/errors";
import { errorResponse } from "@shared/utils/response";
import type {
	Response,
	Request,
	NextFunction,
	ErrorRequestHandler,
	RequestHandler,
} from "express";
export const errHandler: ErrorRequestHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (isErrorResponse(err)) {
		errorResponse(res, err.status, err.message, err);
		return;
	}
	errorResponse(res, 500, err.message);
};

export const notFoundHandler: RequestHandler = (req, res, next) => {
	next(new ErrorResponse(404, "NOT FOUND"));
};
