import { db, members, Member } from "../db";
import { InferSelectModel, eq } from "drizzle-orm";

const fields = {
  id: members.id,
  email: members.email,
  hashed_password: members.hashed_password,
  created_at: members.created_at,
  phone_number: members.phone_number,
  first_name: members.first_name,
  last_name: members.last_name,
  profile_type: members.profile_type,
};

// export const createMember = async (rawMember: Omit<Member, "id">) => {
//   const [createdMember] = await db
//     .insert(members)
//     .values(rawMember)
//     .returning(fields);
//   return createdMember;
// };

export const readMember = async (id: number) => {
  const [member] = await db
    .select(fields)
    .from(members)
    .where(eq(members.id, id));
  return member;
};

export const updateMember = async (
  id: number,
  updatedMember: Partial<Member>
) => {
  const [member] = await db
    .update(members)
    .set(updatedMember)
    .where(eq(members.id, id))
    .returning(fields);
  return member;
};

export const deleteMember = async (id: number) => {
  const [deletedMember] = await db
    .delete(members)
    .where(eq(members.id, id))
    .returning({ id: members.id });
  return deletedMember;
};

export const readMembers = async () => {
  const membersArray = await db.select().from(members);
  return membersArray;
};
