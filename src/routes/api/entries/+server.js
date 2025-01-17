import {json, error} from "@sveltejs/kit";
import {
  getEntries,
  createEntry,
  getCollector,
  getFields,
} from "$lib/server/database.js";

/** @type {import('./$types').RequestHandler} */
export async function GET({url}) {
  try {
    const collectorId = url.searchParams.get("collectorId");
    const date = url.searchParams.get("date");

    if (!collectorId?.trim()) {
      throw error(400, {
        message: "Collector ID is required",
        code: "INVALID_COLLECTOR_ID",
      });
    }

    if (!date?.trim()) {
      throw error(400, {
        message: "Date is required",
        code: "INVALID_DATE",
      });
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw error(400, {
        message: "Invalid date format. Use YYYY-MM-DD",
        code: "INVALID_DATE_FORMAT",
      });
    }

    // Check if collector exists
    const collector = await getCollector(collectorId);
    if (!collector) {
      throw error(404, {
        message: "Collector not found",
        code: "COLLECTOR_NOT_FOUND",
      });
    }

    const entries = await getEntries(collectorId, date);
    return json(entries);
  } catch (err) {
    console.error("Failed to get entries:", err);
    throw error(err.status || 500, {
      message: err.message || "Failed to get entries",
      code: err.code || "ENTRIES_FETCH_ERROR",
    });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function POST({request}) {
  try {
    const data = await request.json();
    const {collectorId, date, values} = data;

    if (!collectorId?.trim()) {
      throw error(400, {
        message: "Collector ID is required",
        code: "INVALID_COLLECTOR_ID",
      });
    }

    if (!date?.trim()) {
      throw error(400, {
        message: "Date is required",
        code: "INVALID_DATE",
      });
    }

    if (!Array.isArray(values)) {
      throw error(400, {
        message: "Values must be an array",
        code: "INVALID_VALUES",
      });
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw error(400, {
        message: "Invalid date format. Use YYYY-MM-DD",
        code: "INVALID_DATE_FORMAT",
      });
    }

    // Check if collector exists and get its fields
    const [collector, fields] = await Promise.all([
      getCollector(collectorId),
      getFields(collectorId),
    ]);

    if (!collector) {
      throw error(404, {
        message: "Collector not found",
        code: "COLLECTOR_NOT_FOUND",
      });
    }

    // Check max occurrences per day
    if (collector.max_occurrences_per_day !== -1) {
      const existingEntries = await getEntries(collectorId, date);
      if (existingEntries.length >= collector.max_occurrences_per_day) {
        throw error(400, {
          message: `Maximum entries per day (${collector.max_occurrences_per_day}) reached`,
          code: "MAX_ENTRIES_REACHED",
        });
      }
    }

    // Validate field values
    const validatedValues = values.map(({fieldId, value}) => {
      const field = fields.find((f) => f.id === fieldId);
      if (!field) {
        throw error(400, {
          message: `Invalid field ID: ${fieldId}`,
          code: "INVALID_FIELD_ID",
        });
      }

      // Convert value based on field type
      let processedValue = value;
      if (field.type === "number") {
        if (value === null || value === undefined || value === "") {
          processedValue = "0";
        } else {
          const num = Number(value);
          if (isNaN(num)) {
            throw error(400, {
              message: `Invalid number value for field: ${field.label}`,
              code: "INVALID_NUMBER_VALUE",
            });
          }
          processedValue = num.toString();
        }
      } else if (field.type === "checkbox") {
        processedValue = (value === true || value === "true").toString();
      } else if (field.type === "text" || field.type === "textarea") {
        processedValue = value?.toString() ?? "";
      }

      return {
        fieldId,
        value: processedValue,
      };
    });

    const id = await createEntry({
      collectorId,
      date,
      values: validatedValues,
    });

    return json({
      id,
      message: "Entry created successfully",
    });
  } catch (err) {
    console.error("Failed to create entry:", err);
    throw error(err.status || 500, {
      message: err.message || "Failed to create entry",
      code: err.code || "ENTRY_CREATE_ERROR",
    });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      Allow: "GET, POST, OPTIONS",
    },
  });
}
