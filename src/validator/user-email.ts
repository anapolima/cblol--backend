import { IUser } from "../model";

class UserEmailValidator
{
    public errors: Partial<IUser>;
    public email: string;

    public constructor (_email: string)
    {
        this.errors = {};
        this.email = this.validate(_email);
    }

    private validate (_email: string): string
    {
        if (typeof _email === "string")
        {
            const email: string = _email.trim();

            // eslint-disable-next-line prefer-named-capture-group
            const regex = /^(\S+)@((?:(?:(?!-)[a-zA-Z0-9-]{1,62}[a-zA-Z0-9])\.)+[a-zA-Z0-9]{2,12})$/;

            if (regex.test(email))
            {
                return email;
            }

            this.errors.email = "Invalid email format";

            return undefined;
        }

        this.errors.email = "Email must be a string";

        return undefined;
    }

}

export { UserEmailValidator };
