import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import "dotenv/config";
import { Pool } from "pg";
import memberRouter from "./routers/member.router";
import classRouter from "./routers/class.router";
const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const validateConnection = async () => {
  try {
    const result = await pool.query("SELECT 1");
    console.log("Database connection successful:", result.rows);
    app.listen(3000, () => {
      console.log(`\x1b[32m Server is running on port 3000\x1b[0m`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

app.use(cors());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api/members", memberRouter);
app.use("/api/classes", classRouter);

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello World!");
});

app.all("*", (req, res) => {
  console.log(`404: ${req.method} ${req.path}`);
  res.sendStatus(404);
});

validateConnection();
