import { Request, Response, NextFunction } from "express";
import { db, sessions } from "../db";
import { eq, and, gt } from "drizzle-orm";

export const authenticateSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionId = req.headers.authorization?.split(" ")[1];

  if (!sessionId) {
    res.status(401).json({ message: "No session provided" });
  }
  const [session] = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.id, sessionId), gt(sessions.expires_at, new Date())))
    .limit(1);

  if (!session) {
    throw new Error("Invalid or expired session");
  }

  req.body.memberId = session.member_id;
  next();
};
