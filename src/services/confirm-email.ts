import { Conflict, InternalServerError, NotFound } from "../core/error-response";
import { IQueryParams, TokenType } from "../models";
import { MongoUsers } from "../clients";
import { ValidateTokenService } from "./validate-token";

class ConfirmEmailService
{
    private readonly validateToken = ValidateTokenService;
    private readonly database = MongoUsers;

    private currentTime: Date;
    private token: string;

    public constructor ( _queryParams: Partial<IQueryParams>)
    {
        this.token = _queryParams.token;
    }

    public async execute ():
    Promise<boolean>
    {
        try
        {
            const validToken = await new this.validateToken(TokenType.EMAIL, this.token).execute();

            if (validToken.length > 0)
            {
                if (validToken[0].activated_at)
                {
                    throw new Conflict({ detail: "This email is already activated!" });
                }

                this.currentTime = new Date();

                await new this.database().updateUserData({
                    _id: validToken[0]._id,
                    activated_at: this.currentTime.toJSON(),
                    updated_at: this.currentTime.toJSON(),
                });

                return true;
            }

            throw new NotFound({ detail: "Invalid token!" });
        }

        catch (err)
        {
            const errType = err.constructor.name;

            switch (errType)
            {
                case "Conflict":
                case "NotFound":
                case "ServiceUnavailable":
                    throw err;
                default:
                    throw new InternalServerError({
                        detail: "An error occurred while trying to confirm email"
                    });
            }
        }
    }
}

export { ConfirmEmailService };
