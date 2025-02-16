import { InferInsertModel, InferSelectModel, eq } from "drizzle-orm";
import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  phonenumber: text("phonenumber").notNull(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  profiletype: text("profiletype").notNull(),
});

export type Member = InferSelectModel<typeof members>;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

const validateConnection = async () => {
  try {
    const result = await pool.query("SELECT 1");
    console.log("Database connection successful:", result.rows);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

validateConnection();

export const getMembers = async () =>
  await db
    .select({
      id: members.id,
      email: members.email,
      phonenumber: members.phonenumber,
      firstname: members.firstname,
      lastname: members.lastname,
      profiletype: members.profiletype,
    })
    .from(members);

export const getMemberById = async (id: number) =>
  await db.select().from(members).where(eq(members.id, id));

export const createMember = async (newMember: Omit<Member, "id">) =>
  await db.insert(members).values(newMember).returning({
    id: members.id,
    email: members.email,
    phonenumber: members.phonenumber,
    firstname: members.firstname,
    lastname: members.lastname,
    profiletype: members.profiletype,
  });

export const updateMemberById = async (id: number, updatedMember: Member) =>
  await db
    .update(members)
    .set(updatedMember)
    .where(eq(members.id, id))
    .returning({
      id: members.id,
      email: members.email,
      phonenumber: members.phonenumber,
      firstname: members.firstname,
      lastname: members.lastname,
      profiletype: members.profiletype,
    });

export const deleteMemberById = async (id: number) =>
  await db.delete(members).where(eq(members.id, id)).returning();
