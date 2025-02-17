import express from "express";
import {
  getMembers,
  createMember,
  getMemberById,
  updateMemberById,
  deleteMemberById,
  Member,
} from "../db/member";
import {
  enrollMember,
  unenrollMember,
  verifyEnrollment,
  getMemberEnrollments,
  Enrollment,
} from "../db/enrollment";

const memberRouter = express.Router();

memberRouter.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const newMember: Omit<Member, "id"> = req.body;
    const createdMember: Member = await createMember(newMember);
    res.status(201).json(createdMember);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

memberRouter.post(
  "/:id/enrollments",
  async (req: express.Request, res: express.Response) => {
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

      const currentEnrollments: Pick<Enrollment, "id"> = await verifyEnrollment(
        memberId,
        classId
      );

      if (currentEnrollments) {
        res.status(400).json({ error: "Duplicate enrollment detected" });
        return;
      }

      const enrollment: Enrollment = await enrollMember(memberId, classId);
      res.status(201).json(enrollment);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }
);

memberRouter.delete(
  "/:id/enrollments",
  async (req: express.Request, res: express.Response) => {
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
      console.log("unenrolling...");
      await unenrollMember(memberId, classId);
      res.sendStatus(204);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }
);

memberRouter.get(
  "/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      const id = parseInt(req.params.id);
      const member = await getMemberById(id);
      if (!member) {
        res.sendStatus(404);
        return;
      }
      res.status(200).json(member);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }
);

memberRouter.get(
  "/:id/enrollments",
  async (req: express.Request, res: express.Response) => {
    try {
      const id = parseInt(req.params.id);
      const member = await getMemberById(id);
      if (!member) {
        res.sendStatus(404);
        return;
      }
      const enrollments = await getMemberEnrollments(id);
      res.status(200).json(enrollments);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }
);

memberRouter.put(
  "/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      const id = parseInt(req.params.id);
      const updatedMember = req.body;
      const member = await updateMemberById(id, updatedMember);

      if (!member) {
        res.sendStatus(404);
        return;
      }
      res.status(200).json(member);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }
);

memberRouter.delete(
  "/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      const id = parseInt(req.params.id);
      const deletedMember = await deleteMemberById(id);
      if (!deletedMember) {
        res.sendStatus(404);
        return;
      }
      console.log({ deletedMember });
      res.sendStatus(204);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }
);

memberRouter.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const members = await getMembers();
    res.status(200).json(members);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

export default memberRouter;
