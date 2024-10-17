import type {Request, Response, NextFunction, Handler} from 'express'
export default function asyncHandler(fn: Handler) {
  return  (req: Request, res:Response, next:NextFunction) => {
    Promise.resolve(fn(req,res,next)).catch(next)
  }
}