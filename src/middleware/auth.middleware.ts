import { Request, Response, NextFunction } from "express";
import { db, sessions } from "../db";
import { eq, and, gt } from "drizzle-orm";
// import "../../types/express.d.ts";

export const authenticateSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionId = req.cookies.sessionId;
  console.log(req.cookies);

  if (!sessionId) {
    res.status(401).send("Unauthorized: No sessionId cookie found");
    return;
  }

  // basic token verification
  const [session] = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.id, sessionId), gt(sessions.expires_at, new Date())))
    .limit(1);

  if (!session) {
    res.status(401).json({ message: "Invalid or expired session" });
    return;
  }

  next();
};

export const authorizeMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const memberIdFromRequest = (req as unknown as { memberId: number }).memberId;
  const memberIdFromRoute = req.params.id;

  console.log({ params: req.params, memberIdFromRequest, memberIdFromRoute });
  if (memberIdFromRequest === Number(memberIdFromRoute)) {
    next();
    return;
  }

  res
    .status(403)
    .json({ message: "You are not authorized to access this data" });
};
