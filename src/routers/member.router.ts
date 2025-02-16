import express from "express";
import {
  getMembers,
  createMember,
  getMemberById,
  updateMemberById,
  deleteMemberById,
  Member,
} from "../db/member";

const memberRouter = express.Router();

memberRouter.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const newMember: Omit<Member, "id"> = req.body;
    const createdMember = await createMember(newMember);
    res.status(201).json(createdMember);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

memberRouter.get(
  "/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      const id = parseInt(req.params.id);
      const member = await getMemberById(id);
      if (!member || !member.length) {
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

memberRouter.put(
  "/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      const id = parseInt(req.params.id);
      const updatedMember = req.body;
      const member = await updateMemberById(id, updatedMember);

      if (!member || !member.length) {
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
      if (!deletedMember || !deletedMember.length) {
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
