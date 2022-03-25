import { genSalt, hash } from "bcrypt";
import { config } from "../config";

class EncryptPasswd
{
    public password: Promise<string>;
    private readonly bcryptSalt = Number(config.bcryptSalt);

    public constructor (_password: string)
    {
        this.password = this.encrypt(_password);
    }

    private async encrypt (_password: string): Promise<string>
    {
        const salt = await genSalt(this.bcryptSalt);
        const enctyptedPasswd = await hash(_password, salt);

        return enctyptedPasswd;
    }
}

export { EncryptPasswd };
