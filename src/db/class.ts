import { InferSelectModel, eq } from "drizzle-orm";
import { pgTable, serial, text, date, integer } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { members } from "./member";

export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  tag: text("tag").notNull(),
  instructor_id: serial("instructor_id").references(() => members.id),
  class_date: date("class_date").notNull(),
  capacity: integer("capacity").notNull(),
});

export type Class = InferSelectModel<typeof classes>;
const fields = {
  id: classes.id,
  category: classes.category,
  tag: classes.tag,
  instructor_id: classes.instructor_id,
  class_date: classes.class_date,
  capacity: classes.capacity,
};
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export const getClasses = async () => await db.select(fields).from(classes);

export const createClass = async (newClass: Omit<Class, "id">) =>
  await db.insert(classes).values(newClass).returning();
// export const getClassById = async () =>

// export const updateClassById = async () =>

// export const deleteClassById = async () =>
