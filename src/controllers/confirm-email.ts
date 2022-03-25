import { InternalServerError, StatusOK } from "../core";
import { Request, Response } from "express";
import { ConfirmEmailService } from "../services/confirm-email";

class ConfirmEmail
{
    private readonly service = ConfirmEmailService;

    public async handle (req: Request, res: Response)
    {
        try
        {
            await new this.service(req.query).execute();

            return new StatusOK({ detail: "Successfully confirmed email!" }).send(res);
        }
        catch (err)
        {
            const errorType = err.constructor.name;

            switch (errorType)
            {
                case "Conflict":
                case "InternalServerError":
                case "NotFound":
                case "ServiceUnavailable":
                    err.send(res);
                    break;
                default:
                    return new InternalServerError({
                        detail: "Unexpected failure"
                    }).send(res);
            }
        }
    }
}

export { ConfirmEmail };
