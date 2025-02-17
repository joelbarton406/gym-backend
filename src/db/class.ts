import { InferSelectModel, eq } from "drizzle-orm";
import { pgTable, serial, text, date, integer } from "drizzle-orm/pg-core";
import { db } from "./index";
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

export const getClasses = async () => await db.select(fields).from(classes);

export const createClass = async (newClass: Omit<Class, "id">) => {
  const data = await db.insert(classes).values(newClass).returning(fields);
  return data[0];
};

export const getClassById = async (classId: number) => {
  const data = await db
    .select(fields)
    .from(classes)
    .where(eq(classes.id, classId));
  return data[0];
};

export const updateClassById = async (classId: number, updatedClass: Class) => {
  const data = await db
    .update(classes)
    .set(updatedClass)
    .where(eq(classes.id, classId))
    .returning(fields);
  return data[0];
};

export const deleteClassById = async (classId: number) => {
  await db.delete(classes).where(eq(classes.id, classId)).returning();
};
