import { IUser } from "../models";

class UserTypeValidator
{
    public errors: Partial<IUser>;
    public type: number;

    public constructor (_type: string)
    {
        this.errors = {};
        this.type = this.validate(_type);
    }

    private validate (_type: string): number
    {
        const type: string = _type;

        if (type)
        {
            if (typeof (type) === "string")
            {
                const letterE = type.indexOf("e");

                if (letterE === -1)
                {
                    if ((type === "2" || type === "4") && Number(type))
                    {
                        return Number(type);
                    }

                    this.errors.type = "Invalid user type";

                    return undefined;
                }

                this.errors.type = "Invalid user type";

                return undefined;
            }

            this.errors.type = "Invalid user type";

            return undefined;
        }

        return undefined;
    }
}

export { UserTypeValidator };
