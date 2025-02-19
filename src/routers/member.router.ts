import express from "express";

import {
  authenticateSession,
  authorizeMember,
} from "../middleware/auth.middleware";
import {
  readMembers,
  readMember,
  updateMember,
  deleteMember,
} from "../controllers/member.controller";

import {
  enrollMember,
  unenrollMember,
  getMemberEnrollments,
} from "../controllers/enrollment.controller";

const memberRouter = express.Router();

memberRouter.get("/:id", authenticateSession, authorizeMember, readMember);
memberRouter.put("/:id", authenticateSession, authorizeMember, updateMember);
memberRouter.delete("/:id", authenticateSession, authorizeMember, deleteMember);

memberRouter.get("/", readMembers);
memberRouter.get("/:id/enrollments", getMemberEnrollments);
memberRouter.post("/:id/enrollments", enrollMember);
memberRouter.delete("/:id/enrollments", unenrollMember);

export default memberRouter;
