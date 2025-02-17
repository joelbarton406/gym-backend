import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

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
