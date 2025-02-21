import express, { Request, Response } from "express";
import {
  readClasses,
  createClass,
  //   getClassById,
  //   updateClassById,
  //   deleteClassById,
} from "../controllers/class.controller";

const classRouter = express.Router();

classRouter.post("/", (req: Request, res: Response) => {
  res.status(200).json("Create a class");
});
classRouter.get("/", readClasses);

export default classRouter;
