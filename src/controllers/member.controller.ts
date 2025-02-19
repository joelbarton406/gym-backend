import { Request, Response } from "express";
import * as memberService from "../services/member.service";

export const readMembers = async (req: Request, res: Response) => {
  try {
    const membersArray = await memberService.readMembers();
    res.status(200).json(membersArray);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// export const createMember = async (req: Request, res: Response) => {
//   try {
//     const rawMember = req.body;
//     const createdMember = await memberService.createMember(rawMember);
//     res.status(201).json(createdMember);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ error: error.message });
//   }
// };

export const readMember = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const member = await memberService.readMember(id);
    if (!member) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(member);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updatedMember = req.body;
    const member = await memberService.updateMember(id, updatedMember);
    if (!member) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(member);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deletedMember = await memberService.deleteMember(id);
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
};
