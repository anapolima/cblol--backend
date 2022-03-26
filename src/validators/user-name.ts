import { IUser } from "../models";

class UserNameValidator
{
    public errors: Partial<IUser> = {};
    public fullname: string;
    private readonly nameMaxLength = 80;
    private readonly nameMinLength = 3;

    public constructor (_name: string)
    {
        this.fullname = this.validate(_name);
    }

    private validate (_name: string): string
    {
        if (typeof (_name) === "string")
        {
            if (_name.trim())
            {
                const name = _name.trim();

                if (name.length <= this.nameMaxLength && name.length >= this.nameMinLength)
                {
                    return name;
                }
                this.errors.fullname =
                    // eslint-disable-next-line max-len
                    `The name must be at least ${this.nameMinLength} characters and be less than or equal to ${this.nameMaxLength} characters. The given name is ${name.length} characters`;

                return undefined;
            }
            this.errors.fullname = "The name cannot be composed of space characters only";

            return undefined;
        }
        this.errors.fullname = "The name must be a string";

        return undefined;
    }
}

export { UserNameValidator };
