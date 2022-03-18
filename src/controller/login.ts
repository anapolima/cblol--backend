import { Request, Response } from "express";
import { LoginService } from "../service/index";

class Login
{
    private readonly service = new LoginService();

    public async handle (req: Request, res: Response)
    {
        await this.service.execute();

        console.log("Controller login works!");
    }
}

export { Login };
