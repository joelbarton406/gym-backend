import { InferInsertModel, InferSelectModel, eq, and } from "drizzle-orm";
import { date, pgTable, serial, integer } from "drizzle-orm/pg-core";
import { db } from "./index";
import { members } from "./member";
import { classes } from "./class";

export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  member_id: integer("member_id")
    .notNull()
    .references(() => members.id),
  class_id: integer("class_id")
    .notNull()
    .references(() => classes.id),
  enrollment_date: date("enrollment_date").notNull(),
});

export type Enrollment = InferSelectModel<typeof enrollments>;

export const enrollMember = async (memberId: number, classId: number) => {
  const data = await db
    .insert(enrollments)
    .values({
      member_id: memberId,
      class_id: classId,
      enrollment_date: new Date().toISOString(),
    })
    .returning();

  return data[0];
};

export const unenrollMember = async (memberId: number, classId: number) =>
  await db
    .delete(enrollments)
    .where(
      and(
        eq(enrollments.member_id, memberId),
        eq(enrollments.class_id, classId)
      )
    )
    .returning();

export const verifyEnrollment = async (memberId: number, classId: number) => {
  const data = await db
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(
      and(
        eq(enrollments.member_id, memberId),
        eq(enrollments.class_id, classId)
      )
    );
  return data[0];
};

export const getMemberEnrollments = async (memberId: number) =>
  await db
    .select({
      id: enrollments.id,
      enrollment_date: enrollments.enrollment_date,
      member_id: enrollments.member_id,
      class_id: enrollments.class_id,
      class_category: classes.category,
      class_tag: classes.tag,
      class_instructor_id: classes.instructor_id,
      class_date: classes.class_date,
      class_capacity: classes.capacity,
    })
    .from(enrollments)
    .innerJoin(classes, eq(enrollments.class_id, classes.id))
    .where(eq(enrollments.member_id, memberId));

export const getClassEnrollments = async (classId: number) =>
  await db
    .select({
      id: members.id,
      email: members.email,
      phonenumber: members.phonenumber,
      firstname: members.firstname,
      lastname: members.lastname,
    })
    .from(enrollments)
    .innerJoin(members, eq(enrollments.member_id, members.id))
    .where(eq(enrollments.class_id, classId));
