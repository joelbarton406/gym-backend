import express from "express";
import { authenticateSession } from "../middleware/auth.middleware";
import { signup, login, logout } from "../controllers/auth.controller";
const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", authenticateSession, logout);

export default authRouter;

/* 
client -> signup -> validate request & authService.signup
    -> create newMember/store in database
    -> generate token, attach token to response
    -> redirect to auth/login


client -> login -> validate request & authService.login
    -> returns session

*/
