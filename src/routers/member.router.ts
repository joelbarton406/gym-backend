import express from "express";
import {
  readMembers,
  // createMember,
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

memberRouter.get("/", readMembers);
// memberRouter.post("/", createMember);
memberRouter.get("/:id", readMember);
memberRouter.put("/:id", updateMember);
memberRouter.delete("/:id", deleteMember);

memberRouter.get("/:id/enrollments", getMemberEnrollments);
memberRouter.post("/:id/enrollments", enrollMember);
memberRouter.delete("/:id/enrollments", unenrollMember);

export default memberRouter;
