import { db, members, classes, enrollments, Enrollment } from "../db";
import { eq, and } from "drizzle-orm";

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

export const enrollMemberInClass = async (
  memberId: number,
  classId: number
) => {
  const [enrollment] = await db
    .insert(enrollments)
    .values({
      member_id: memberId,
      class_id: classId,
      enrollment_date: new Date().toISOString(),
    })
    .returning();
  return enrollment;
};

export const unenrollMemberFromClass = async (
  memberId: number,
  classId: number
) => {
  await db
    .delete(enrollments)
    .where(
      and(
        eq(enrollments.member_id, memberId),
        eq(enrollments.class_id, classId)
      )
    )
    .returning();
};

export const getMemberEnrollmentsFromDb = async (memberId: number) => {
  const enrollmentsArray = await db
    .select({
      id: enrollments.id,
      enrollment_date: enrollments.enrollment_date,
      member_id: enrollments.member_id,
      class_id: enrollments.class_id,
      class_category: classes.category,
      class_tag: classes.tag,
      class_staff_id: classes.staff_id,
      class_date: classes.class_date,
      class_capacity: classes.capacity,
    })
    .from(enrollments)
    .innerJoin(classes, eq(enrollments.class_id, classes.id))
    .where(eq(enrollments.member_id, memberId));

  return enrollmentsArray;
};

export const getClassEnrollmentsFromDb = async (classId: number) => {
  const data = await db
    .select({
      id: members.id,
      email: members.email,
      phone_number: members.phone_number,
      first_name: members.first_name,
      last_name: members.last_name,
    })
    .from(enrollments)
    .innerJoin(members, eq(enrollments.member_id, members.id))
    .where(eq(enrollments.class_id, classId));

  return data;
};
