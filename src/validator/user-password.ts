import { IUser } from "../model";

class UserPasswordValidator
{
    public errors: Partial<IUser>;
    public password: string;

    // eslint-disable-next-line max-len
    private readonly passwdRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!../#$%&*()+\-.,;?^.,;?><:{}[\]])[\w!../#$%&*()+\-.,;?^.,;?><:{}[\]]{6,22}$/;

    public constructor (_passwd:  string)
    {
        this.errors = {};
        this.password = this.validate(_passwd);
    }

    private validate (_password: string) : string
    {
        if (this.passwdRegex.test(_password))
        {
            return _password;
        }

        this.errors.password =
            // eslint-disable-next-line max-len
            "The password must contain uppercase and lowercase letters, numbers and symbols (!../#$%&*()-+.,;?{[}]^><:) and have between 6 and 22 characters";

        return undefined;
    }
}

export { UserPasswordValidator };
