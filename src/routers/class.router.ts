import express from "express";
import {
  readClasses,
  createClass,
  //   getClassById,
  //   updateClassById,
  //   deleteClassById,
} from "../controllers/class.controller";

const classRouter = express.Router();

classRouter.post("/", createClass);
classRouter.get("/", readClasses);

export default classRouter;
