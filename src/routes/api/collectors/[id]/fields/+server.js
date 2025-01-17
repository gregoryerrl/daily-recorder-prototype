import {json, error} from "@sveltejs/kit";
import {getFields, createField, getCollector} from "$lib/server/database.js";

const VALID_FIELD_TYPES = ["text", "number", "textarea", "checkbox"];

/** @type {import('./$types').RequestHandler} */
export async function GET({params}) {
  try {
    if (!params.id?.trim()) {
      throw error(400, {
        message: "Collector ID is required",
        code: "INVALID_COLLECTOR_ID",
      });
    }

    // Check if collector exists
    const collector = await getCollector(params.id);
    if (!collector) {
      throw error(404, {
        message: "Collector not found",
        code: "COLLECTOR_NOT_FOUND",
      });
    }

    const fields = await getFields(params.id);
    return json(fields);
  } catch (err) {
    console.error("Failed to get fields:", err);
    throw error(err.status || 500, {
      message: err.message || "Failed to get fields",
      code: err.code || "FIELDS_FETCH_ERROR",
    });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function POST({params, request}) {
  try {
    if (!params.id?.trim()) {
      throw error(400, {
        message: "Collector ID is required",
        code: "INVALID_COLLECTOR_ID",
      });
    }

    // Check if collector exists
    const collector = await getCollector(params.id);
    if (!collector) {
      throw error(404, {
        message: "Collector not found",
        code: "COLLECTOR_NOT_FOUND",
      });
    }

    const data = await request.json();
    const {label, type, required, settings} = data;

    if (!label?.trim()) {
      throw error(400, {
        message: "Label is required and cannot be empty",
        code: "INVALID_LABEL",
      });
    }

    if (!type || !VALID_FIELD_TYPES.includes(type)) {
      throw error(400, {
        message: `Type must be one of: ${VALID_FIELD_TYPES.join(", ")}`,
        code: "INVALID_TYPE",
      });
    }

    const id = await createField({
      collectorId: params.id,
      label: label.trim(),
      type,
      required: required ?? true,
      settings: settings ?? {},
    });

    return json({
      id,
      message: "Field created successfully",
    });
  } catch (err) {
    console.error("Failed to create field:", err);
    throw error(err.status || 500, {
      message: err.message || "Failed to create field",
      code: err.code || "FIELD_CREATE_ERROR",
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
