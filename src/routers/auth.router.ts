import express from "express";
import { authenticateSession } from "../middleware/auth.middleware";
import { signup, login, logout } from "../controllers/auth.controller";
const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", authenticateSession, logout);
authRouter.all("*", (req, res) => {
  const red = "\x1b[31m";
  const green = "\x1b[32m";
  const blue = "\x1b[34m";
  const pink = "\x1b[35m";
  const reset = "\x1b[0m"; // Reset color
  console.log(
    `${red}invalid route: ${green}${req.method} ${blue}${req.path}${reset}`
  );
  res.sendStatus(404);
});
export default authRouter;


/* 
client -> signup -> validate request & authService.signup
    -> create newMember/store in database
    -> generate token, attach token to response
    -> redirect to auth/login


client -> login -> validate request & authService.login
    -> returns session

*/
