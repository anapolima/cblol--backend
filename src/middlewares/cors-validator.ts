import { CorsOptions } from "cors";
import { config } from "config";

class CorsValidator
{
    public corsOptions: Partial<CorsOptions> = {};

    public constructor ()
    {
        this.setCorsOptions();
    }

    private setCorsOptions ()
    {
        this.setOrigin();
    }

    private setOrigin (): void
    {
        this.corsOptions.origin = (origin, callback) =>
        {
            if (origin && config.whiteList.indexOf(origin) === -1)
            {
                callback(new Error("Not allowed by CORS"));
            }
            else
            {
                callback(null, true);
            }
        };
    }

}

export { CorsValidator };
