import { db, classes, Class } from "../db";
import { Request, Response } from "express";
import * as classesService from "../services/class.service";

export const readClasses = async (req: Request, res: Response) => {
  try {
    const classesArray = await classesService.readClasses();
    res.status(200).json(classesArray);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

export const createClass = async (req: Request, res: Response) => {
  try {
    const newClass: Omit<Class, "id"> = req.body;
    const createdClass = await classesService.createClass(newClass);
    res.status(201).json(createdClass);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
