import { IUser } from "../models";

class UserUsernameValidator
{
    public errors: Partial<IUser>;
    public username: string;
    private readonly usernameRegex = /^[0-9A-Z\s]{3,16}$/i;

    public constructor (_username: string)
    {
        this.errors = {};
        this.username = this.validate(_username);
    }

    private validate (_username: string): string
    {
        if (typeof (_username) === "string")
        {
            if (_username.trim())
            {
                const username = _username.trim();

                if (this.usernameRegex.test(username))
                {
                    return username;
                }

                this.errors.username =
                    // eslint-disable-next-line max-len
                    `The username must be at least 3 characters and be less than or equal to 16 characters, composed of letters, numbers and space characteres only. The given username is ${username.length} characters`;

                return undefined;
            }

            this.errors.username = "The username cannot be composed of space characters only";

            return undefined;
        }

        this.errors.username = "The username must be a string";

        return undefined;
    }
}

export { UserUsernameValidator };
