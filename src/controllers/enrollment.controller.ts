import { Request, Response } from "express";
import {
  verifyEnrollment,
  enrollMemberInClass,
  unenrollMemberFromClass,
  getMemberEnrollmentsFromDb,
  getClassEnrollmentsFromDb,
} from "../services/enrollment.service";

export const enrollMember = async (req: Request, res: Response) => {
  try {
    const memberId = parseInt(req.params.id, 10);

    if (!req.query.class_id) {
      res.status(400).json({ error: "class_id query parameter is required" });
      return;
    }

    const classId = Number(req.query.class_id);

    if (isNaN(classId)) {
      res
        .status(400)
        .json({ error: "Invalid class_id, class_id must be a Number" });
      return;
    }

    const currentEnrollments = await verifyEnrollment(memberId, classId);

    if (currentEnrollments) {
      res.status(400).json({ error: "Duplicate enrollment detected" });
      return;
    }

    const enrollment = await enrollMemberInClass(memberId, classId);
    res.status(201).json(enrollment);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

export const unenrollMember = async (req: Request, res: Response) => {
  try {
    const memberId = parseInt(req.params.id, 10);

    if (!req.query.class_id) {
      res.status(400).json({ error: "class_id query parameter is required" });
      return;
    }

    const classId = Number(req.query.class_id);

    if (isNaN(classId)) {
      res.status(400).json({ error: "Invalid class_id" });
      return;
    }

    await unenrollMemberFromClass(memberId, classId);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

export const getMemberEnrollments = async (req: Request, res: Response) => {
  try {
    const memberId = parseInt(req.params.id);
    const enrollmentsArray = await getMemberEnrollmentsFromDb(memberId);
    res.status(200).json(enrollmentsArray);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

export const getClassEnrollments = async (req: Request, res: Response) => {
  try {
    const classId = parseInt(req.params.id);
    const enrollmentsArray = await getClassEnrollmentsFromDb(classId);
    res.status(200).json(enrollmentsArray);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
