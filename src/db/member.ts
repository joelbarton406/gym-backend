import { InferInsertModel, InferSelectModel, eq } from "drizzle-orm";
import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { db } from "./index";

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  phonenumber: text("phonenumber").notNull(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  profiletype: text("profiletype").notNull(),
});

export type Member = InferSelectModel<typeof members>;

const fields = {
  id: members.id,
  email: members.email,
  phonenumber: members.phonenumber,
  firstname: members.firstname,
  lastname: members.lastname,
  profiletype: members.profiletype,
};

export const getMembers = async () => await db.select().from(members);

export const createMember = async (newMember: Omit<Member, "id">) => {
  const data = await db.insert(members).values(newMember).returning(fields);
  return data[0];
};

export const getMemberById = async (
  id: number
): Promise<Pick<Member, "id">> => {
  const data = await db.select(fields).from(members).where(eq(members.id, id));
  return data[0];
};

export const updateMemberById = async (id: number, updatedMember: Member) => {
  const data = await db
    .update(members)
    .set(updatedMember)
    .where(eq(members.id, id))
    .returning(fields);
  return data[0];
};

export const deleteMemberById = async (id: number) => {
  const data = await db
    .delete(members)
    .where(eq(members.id, id))
    .returning({ id: members.id });
  return data[0];
};
