import { InferSelectModel, eq } from "drizzle-orm";
import { pgTable, serial, text, date, integer } from "drizzle-orm/pg-core";
import { db, classes, Class } from "../db";

const fields = {
  id: classes.id,
  category: classes.category,
  tag: classes.tag,
  staff_id: classes.staff_id,
  class_date: classes.class_date,
  capacity: classes.capacity,
};
export const readClasses = async () => {
  const data = await db.select(fields).from(classes);
  return data;
};

export const createClass = async (newClass: Omit<Class, "id">) => {
  const data = await db.insert(classes).values(newClass).returning(fields);
  return data[0];
};

export const readClass = async (classId: number) => {
  const data = await db
    .select(fields)
    .from(classes)
    .where(eq(classes.id, classId));
  return data[0];
};

export const updateClass = async (classId: number, updatedClass: Class) => {
  const data = await db
    .update(classes)
    .set(updatedClass)
    .where(eq(classes.id, classId))
    .returning(fields);
  return data[0];
};

export const deleteClass = async (classId: number) => {
  await db.delete(classes).where(eq(classes.id, classId)).returning();
};
