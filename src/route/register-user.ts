import { CreateUser } from "controller";
import { Router } from "express";

const router = Router();

router.post("/register-user", new CreateUser().handle.bind(new CreateUser()));

export default router;
