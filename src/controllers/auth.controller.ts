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
    await authService.signup(rawMember);

    const { sessionId, member } = await authService.login({
      email: rawMember.email,
      password: rawMember.password,
    });

    res.status(201).json({ sessionId, member });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const credentials: Credentials = validate(req.body, memberLoginSchema);
    const { sessionId, member } = await authService.login(credentials);
    res.status(200).json({ sessionId, member });
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
