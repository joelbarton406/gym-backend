import { InferSelectModel } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);

export const validateConnection = async () => {
  try {
    const result = await pool.query("SELECT 1");
    console.log("Database connection successful:", result.rows);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

validateConnection();

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  created_at: date("created_at").notNull(),
  phone_number: text("phone_number").notNull(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  profile_type: text("profile_type").notNull(),
});

export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  tag: text("tag").notNull(),
  staff_id: serial("staff_id")
    .references(() => members.id)
    .notNull(),
  class_date: date("class_date").notNull(),
  capacity: integer("capacity").notNull(),
});

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

export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  member_id: integer("member_id")
    .references(() => members.id)
    .notNull(),
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").notNull(),
});

export type Class = InferSelectModel<typeof classes>;
export type Member = InferSelectModel<typeof members>;
export type Session = InferSelectModel<typeof sessions>;
export type Enrollment = InferSelectModel<typeof enrollments>;

export type RawMember = {
  password: string;
} & Omit<Member, "id" | "created_at" | "password">;

export type Credentials = {
  password: string;
  email: string;
};
