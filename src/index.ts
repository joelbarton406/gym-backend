import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import "dotenv/config";

import {
  authenticateSession,
  authorizeMember,
} from "./middleware/auth.middleware";

import memberRouter from "./routers/member.router";
import classRouter from "./routers/class.router";
import authRouter from "./routers/auth.router";

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    exposedHeaders: ["*", "Authorization"],
  })
);
app.use(compression());
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log("Request cookies:", req.cookies);
  console.log("Request headers:", req.headers);
  next();
});
app.use("/api/auth", authRouter);
app.use("/api/members", authenticateSession, memberRouter);
app.use("/api/classes", authenticateSession, classRouter);

app.all("*", (req, res) => {
  console.log(`404: ${req.method} ${req.path}`);
  res.sendStatus(404);
});

app.listen(3000, () => {
  console.log(`\x1b[32m Server is running on port 3000\x1b[0m`);
});
