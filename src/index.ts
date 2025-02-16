import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import "dotenv/config";
import { Pool } from "pg";
import memberRouter from "./routers/member.router";

const app = express();
app.use(cors());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const validateConnection = async () => {
  try {
    const result = await pool.query("SELECT 1");
    console.log("Database connection successful:", result.rows);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello World!");
});

app.use("/members", memberRouter);

app.all("*", (req, res) => {
  console.log(`404: ${req.method} ${req.path}`);
  res.sendStatus(404);
});

validateConnection().then(() => {
  app.listen(3000, () => {
    console.log(`\x1b[32m Server is running on port 3000\x1b[0m`);
  });
});
