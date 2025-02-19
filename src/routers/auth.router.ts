import express from "express";
import { authenticateSession } from "../middleware/auth.middleware";
import { signup, login, logout } from "../controllers/auth.controller";
const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", authenticateSession, logout);

export default authRouter;
