import {createClient} from "@libsql/client";
import {TURSO_DB_URL, TURSO_DB_AUTH_TOKEN} from "$env/static/private";
import {error} from "@sveltejs/kit";

// Validate environment variables
if (!TURSO_DB_URL) {
  throw new Error("TURSO_DB_URL environment variable is not set");
}

if (!TURSO_DB_AUTH_TOKEN) {
  throw new Error("TURSO_DB_AUTH_TOKEN environment variable is not set");
}

// Database error codes
const DB_ERROR_CODES = {
  INVALID_INPUT: "INVALID_INPUT",
  NOT_FOUND: "NOT_FOUND",
  CONSTRAINT_VIOLATION: "CONSTRAINT_VIOLATION",
  DATABASE_ERROR: "DATABASE_ERROR",
};

console.log("Initializing database connection with URL:", TURSO_DB_URL);

export const db = createClient({
  url: TURSO_DB_URL,
  authToken: TURSO_DB_AUTH_TOKEN,
});

// Validation functions
function validateId(id) {
  if (!id?.trim()) {
    throw error(400, {
      message: "Invalid ID provided",
      code: DB_ERROR_CODES.INVALID_INPUT,
    });
  }
}

function validateDate(date) {
  if (!date?.match(/^\d{4}-\d{2}-\d{2}$/)) {
    throw error(400, {
      message: "Invalid date format. Expected YYYY-MM-DD",
      code: DB_ERROR_CODES.INVALID_INPUT,
    });
  }
}

function validateCollector({name, description, maxOccurrencesPerDay}) {
  if (!name?.trim()) {
    throw error(400, {
      message: "Collector name is required",
      code: DB_ERROR_CODES.INVALID_INPUT,
    });
  }
  if (
    maxOccurrencesPerDay !== undefined &&
    maxOccurrencesPerDay !== -1 &&
    (!Number.isInteger(maxOccurrencesPerDay) || maxOccurrencesPerDay < 1)
  ) {
    throw error(400, {
      message: "Max occurrences must be -1 (unlimited) or a positive integer",
      code: DB_ERROR_CODES.INVALID_INPUT,
    });
  }
}

function validateField({label, type, required}) {
  if (!label?.trim()) {
    throw error(400, {
      message: "Field label is required",
      code: DB_ERROR_CODES.INVALID_INPUT,
    });
  }
  if (!["text", "number", "checkbox", "textarea"].includes(type)) {
    throw error(400, {
      message: "Invalid field type",
      code: DB_ERROR_CODES.INVALID_INPUT,
    });
  }
  if (required !== undefined && typeof required !== "boolean") {
    throw error(400, {
      message: "Required must be a boolean",
      code: DB_ERROR_CODES.INVALID_INPUT,
    });
  }
}

// Test database connection
export async function testConnection() {
  try {
    await db.execute("SELECT 1");
    console.log("Database connection successful");
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err;
  }
}

// Initialize database tables
export async function initDatabase() {
  try {
    await testConnection(); // Test connection first

    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Failed to initialize database:", err);
    throw err;
  }
}

// Database operations with improved error handling
export async function getCollectors() {
  try {
    const result = await db.execute(
      "SELECT * FROM collectors ORDER BY created_at DESC"
    );
    return result.rows;
  } catch (err) {
    console.error("Database error in getCollectors:", err);
    throw error(500, {
      message: "Failed to fetch collectors",
      code: DB_ERROR_CODES.DATABASE_ERROR,
    });
  }
}

export async function getCollector(id) {
  try {
    validateId(id);
    const result = await db.execute({
      sql: "SELECT * FROM collectors WHERE id = ?",
      args: [id],
    });

    if (!result.rows[0]) {
      throw error(404, {
        message: "Collector not found",
        code: DB_ERROR_CODES.NOT_FOUND,
      });
    }

    return result.rows[0];
  } catch (err) {
    if (err.status) throw err;
    console.error("Database error in getCollector:", err);
    throw error(500, {
      message: "Failed to fetch collector",
      code: DB_ERROR_CODES.DATABASE_ERROR,
    });
  }
}

export async function getFields(collectorId) {
  try {
    validateId(collectorId);
    const result = await db.execute({
      sql: "SELECT * FROM fields WHERE collector_id = ? ORDER BY created_at ASC",
      args: [collectorId],
    });
    return result.rows;
  } catch (err) {
    if (err.status) throw err;
    console.error("Database error in getFields:", err);
    throw error(500, {
      message: "Failed to fetch fields",
      code: DB_ERROR_CODES.DATABASE_ERROR,
    });
  }
}

export async function getEntries(collectorId, date) {
  try {
    validateId(collectorId);
    validateDate(date);

    // First get the entries
    const entriesResult = await db.execute({
      sql: `SELECT * FROM entries 
            WHERE collector_id = ? AND entry_date = ?
            ORDER BY created_at DESC`,
      args: [collectorId, date],
    });

    // Then get the values for each entry
    const entries = await Promise.all(
      entriesResult.rows.map(async (entry) => {
        const valuesResult = await db.execute({
          sql: `SELECT field_id, value_text 
                FROM entry_values 
                WHERE entry_id = ?`,
          args: [entry.id],
        });

        return {
          ...entry,
          values: valuesResult.rows,
        };
      })
    );

    return entries;
  } catch (err) {
    if (err.status) throw err;
    console.error("Database error in getEntries:", err);
    throw error(500, {
      message: "Failed to fetch entries",
      code: DB_ERROR_CODES.DATABASE_ERROR,
    });
  }
}

export async function createCollector(data) {
  try {
    validateCollector(data);
    const id = crypto.randomUUID();

    await db.execute({
      sql: `INSERT INTO collectors (id, name, description, max_occurrences_per_day)
            VALUES (?, ?, ?, ?)`,
      args: [id, data.name, data.description, data.maxOccurrencesPerDay ?? -1],
    });

    return id;
  } catch (err) {
    if (err.status) throw err;
    console.error("Database error in createCollector:", err);
    throw error(500, {
      message: "Failed to create collector",
      code: DB_ERROR_CODES.DATABASE_ERROR,
    });
  }
}

export async function createField(data) {
  try {
    validateId(data.collectorId);
    validateField(data);

    const id = crypto.randomUUID();
    await db.execute({
      sql: `INSERT INTO fields (id, collector_id, label, type, required, settings)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        data.collectorId,
        data.label,
        data.type,
        data.required ? 1 : 0,
        JSON.stringify(data.settings || {}),
      ],
    });
    return id;
  } catch (err) {
    if (err.status) throw err;
    console.error("Database error in createField:", err);
    throw error(500, {
      message: "Failed to create field",
      code: DB_ERROR_CODES.DATABASE_ERROR,
    });
  }
}

export async function createEntry({collectorId, date, values}) {
  try {
    validateId(collectorId);
    validateDate(date);

    if (!Array.isArray(values) || values.length === 0) {
      throw error(400, {
        message: "Values array is required and must not be empty",
        code: DB_ERROR_CODES.INVALID_INPUT,
      });
    }

    await db.execute("BEGIN TRANSACTION");

    // Create the entry
    const id = crypto.randomUUID();
    await db.execute({
      sql: `INSERT INTO entries (id, collector_id, entry_date)
            VALUES (?, ?, ?)`,
      args: [id, collectorId, date],
    });

    // Insert values
    const valueInserts = values.map(({fieldId, value}) => ({
      sql: `INSERT INTO entry_values (id, entry_id, field_id, value_text)
            VALUES (?, ?, ?, ?)`,
      args: [crypto.randomUUID(), id, fieldId, value?.toString() ?? ""],
    }));

    await db.batch(valueInserts);
    await db.execute("COMMIT");

    return id;
  } catch (err) {
    await db.execute("ROLLBACK");
    if (err.status) throw err;
    console.error("Database error in createEntry:", err);
    throw error(500, {
      message: "Failed to create entry",
      code: DB_ERROR_CODES.DATABASE_ERROR,
    });
  }
}

export async function deleteCollector(id) {
  try {
    validateId(id);

    // For now, just delete the collector and let CASCADE handle the rest
    await db.execute({
      sql: "DELETE FROM collectors WHERE id = ?",
      args: [id],
    });
  } catch (err) {
    if (err.status) throw err;
    console.error("Database error in deleteCollector:", err);
    throw error(500, {
      message: "Failed to delete collector",
      code: DB_ERROR_CODES.DATABASE_ERROR,
    });
  }
}
