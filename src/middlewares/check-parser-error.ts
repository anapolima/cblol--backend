import { NextFunction, Request, Response } from "express";
import { BadRequest } from "../core";

class CheckParserError
{
    public static check (err: unknown, req: Request, res: Response, next: NextFunction)
    {
        if (err instanceof Error)
        {
            return new BadRequest({
                detail: "Error parsing request body",
                message: err.message,
            }).send(res);
        }

        next();
    }
}

export { CheckParserError };
