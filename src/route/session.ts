import { Login } from "../controller/login";
import { Router } from "express";

const router = Router();

router.post("/login", new Login().handle.bind(new Login()));
router.get("/logout");

export default router;
