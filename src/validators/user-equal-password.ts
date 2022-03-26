import { IUser } from "../models";

class EqualPasswordValidator
{
    public errors: Partial<IUser>;
    public confirmPassword: string;

    public constructor (_passwd: string, _confPasswd: string)
    {
        this.errors = {};
        this.confirmPassword = this.validate(_passwd, _confPasswd);
    }

    private validate (_password: string, _confPasswd: string): string
    {
        if (_password === _confPasswd)
        {
            return _confPasswd;
        }

        this.errors.confirmPassword = "Passwords don't match";

        return undefined;
    }
}

export { EqualPasswordValidator };
