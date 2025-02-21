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

    const { sessionId, expiresAt, member } = await authService.login({
      email: rawMember.email,
      password: rawMember.password,
    });

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      expires: expiresAt,
    });

    res.status(201).json({ member });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const credentials: Credentials = validate(req.body, memberLoginSchema);
    const { sessionId, expiresAt, member } = await authService.login(
      credentials
    );

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      expires: expiresAt,
    });

    res.status(200).json({ member });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const sessionId = req.cookies.sessionId;
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
