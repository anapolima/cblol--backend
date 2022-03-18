// TODO Import DBclient/jwt/bcrypt;
import { BadRequest, InternalServerError, NotFound } from "core/error-response";

class LoginService
{
    public async execute ()
    {
        console.log("Service login works!!");
    }
}

export { LoginService };
