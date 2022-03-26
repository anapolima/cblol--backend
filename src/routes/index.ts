import { CheckParserError } from "middlewares";
import Register from "./register-user";
import express from "express";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(CheckParserError.check);

app.use(Register);


export default app;
