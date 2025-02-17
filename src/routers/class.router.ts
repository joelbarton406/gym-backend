import express from "express";
import {
  getClasses,
  createClass,
  //   getClassById,
  //   updateClassById,
  //   deleteClassById,
  Class,
} from "../db/class";

const classRouter = express.Router();

classRouter.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const newClass: Omit<Class, "id"> = req.body;
    const createdClass = await createClass(newClass);
    res.status(201).json(createdClass);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

classRouter.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const classes = await getClasses();
    res.status(200).json(classes);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

export default classRouter;
