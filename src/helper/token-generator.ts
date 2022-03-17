import { CodeGenerator } from ".";
import { config } from "../config";
import { createHash } from "crypto";
import dotenv from "dotenv";
dotenv.config();

class TokenGenerator
{
    private readonly codeLength = Number(config.codeGenerator);
    private readonly genCode = CodeGenerator;
    public token: string;

    public constructor (...args: string[])
    {
        this.token = this.genToken(...args);
    }

    private genToken (...args: string[]): string
    {
        const code: string = new this.genCode(this.codeLength).code.concat(args.join(""));

        const token: string = createHash("sha256").update(code)
            .digest("hex");

        return token;
    }
}

export { TokenGenerator };
