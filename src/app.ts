import { config } from "./config";
import cors from "cors";
import express from "express";

const app = express();
import routes from "./route";

const whiteList: string[] = config.whiteList;

const corsOptions = {
    origin (origin, callback)
    {
        if (origin && whiteList.indexOf(origin) === -1)
        {
            callback(new Error("Not allowed by CORS"));
        }
        else
        {
            callback(null, true);
        }
    }
};
app.use(cors(corsOptions));
app.use(routes);

export { app };
