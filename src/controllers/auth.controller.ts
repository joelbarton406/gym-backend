import { Member, RawMember, Credentials } from "db";
import {
  validate,
  memberSignupSchema,
  memberLoginSchema,
} from "../validators/auth.validator";
import * as authService from "../services/auth.service";
import { Request, Response } from "express";

export const signup = async (req: Request, res: Response) => {
  try {
    const rawMember: RawMember = validate(req.body, memberSignupSchema);
    const newMember: Member = await authService.signup(rawMember);
    res.status(201).json(newMember);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    /* 
    validate credentials
    perform login
    */
    const credentials: Credentials = validate(req.body, memberLoginSchema);
    const session = await authService.login(credentials);
    res.status(200).json(session);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const sessionId = req.headers.authorization?.split(" ")[1];
    if (!sessionId) {
      throw new Error("No session token provided");
    }
    await authService.logout(sessionId);
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
