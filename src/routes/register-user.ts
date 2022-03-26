import { ConfirmEmail } from "controllers/confirm-email";
import { CreateUser } from "controllers";
import { Router } from "express";

const router = Router();

router.post("/register-user", new CreateUser().handle.bind(new CreateUser()));
router.get("/email/confirm", new ConfirmEmail().handle.bind(new ConfirmEmail()));

export default router;
