import { IUser, TokenType } from "../models";
import { InternalServerError } from "../core/error-response";
import { MongoUsers } from "../clients";

class ValidateTokenService
{
    private field: string;
    private token: string;

    private readonly database = MongoUsers;

    constructor (_field: TokenType, _token: string)
    {
        this.field = _field;
        this.token = _token;
    }

    public async execute ():
    Promise<Partial<IUser[]>>
    {
        if (this.field === TokenType.EMAIL)
        {
            try
            {
                const user = await new this.database().listUsersData({
                    filters: {
                        confirm_email_code: this.token
                    }
                });

                return user.data;
            }
            catch (err)
            {
                throw new InternalServerError({ detail: "An error occurred while fetching email token" });
            }
        }

        if (this.field === TokenType.PASSWORD)
        {
            try
            {
                const result = await new this.database().listUsersData({
                    filters: {
                        recovery_passwd_code: this.token
                    },
                });

                return result.data;
            }
            catch (err)
            {
                throw new InternalServerError({ detail: "An error occurred while fetching password token" });
            }
        }
    }
}

export { ValidateTokenService };
