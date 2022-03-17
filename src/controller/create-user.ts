import { InternalServerError, StatusCreated } from "../core";
import { Request, Response } from "express";
import { CreateUserService } from "../service";

class CreateUser
{
    private readonly service = CreateUserService;

    public async handle (req: Request, res: Response)
    {
        try
        {
            const newUser = await new this.service().execute(req.body);

            return new StatusCreated({ detail: newUser.message }).send(res);
        }
        catch (err)
        {
            const errType = err.constructor.name;

            switch (errType)
            {
                case "BadRequest":
                case "UnprocessableEntity":
                case "InternalServerError":
                case "ServiceUnavailable":
                    err.send(res);
                    break;
                default:
                    return new InternalServerError({ detail: "Unexpected failure" }).send(res);
            }
        }
    }
}

export { CreateUser };
