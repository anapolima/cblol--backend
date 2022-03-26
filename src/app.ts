import { CorsValidator } from "middlewares";
import cors from "cors";
import express from "express";

const app = express();
import routes from "./routes";

app.use(cors(new CorsValidator().corsOptions));
app.use(routes);

export { app };
