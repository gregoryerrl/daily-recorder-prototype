import {createClient} from "@libsql/client";
import fs from "fs";
import {TURSO_DB_URL, TURSO_DB_AUTH_TOKEN} from "$env/static/private";

// Create database client
export const db = createClient({
  url: TURSO_DB_URL,
  authToken: TURSO_DB_AUTH_TOKEN,
});

// Initialize database with schema
export async function initializeDatabase() {
  try {
    const schema = fs.readFileSync("src/lib/server/schema.sql", "utf8");
    const statements = schema
      .split(";")
      .filter((statement) => statement.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        await db.execute(statement + ";");
      }
    }
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

// Database helper functions
export async function getCategories() {
  const result = await db.execute("SELECT * FROM categories ORDER BY name");
  return result.rows;
}

export async function getEntries() {
  const result = await db.execute(`
    SELECT e.*, c.name as category_name 
    FROM entries e
    LEFT JOIN categories c ON e.category_id = c.id
    ORDER BY e.created_at DESC
  `);
  return result.rows;
}

export async function getEntry(id) {
  const result = await db.execute({
    sql: "SELECT * FROM entries WHERE id = ?",
    args: [id],
  });
  return result.rows[0];
}

export async function createEntry(title, content, categoryId) {
  const result = await db.execute({
    sql: "INSERT INTO entries (title, content, category_id) VALUES (?, ?, ?) RETURNING id",
    args: [title, content, categoryId],
  });
  return result.rows[0].id;
}

export async function createCategory(name) {
  try {
    const result = await db.execute({
      sql: "INSERT INTO categories (name) VALUES (?) RETURNING id",
      args: [name],
    });
    return result.rows[0].id;
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed")) {
      throw new Error("Category already exists");
    }
    throw error;
  }
}
