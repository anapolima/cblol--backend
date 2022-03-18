import Register from "./register-user";
import Session from "./session";
import express from "express";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(Register);
app.use(Session);


export default app;
