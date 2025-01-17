import {json, error} from "@sveltejs/kit";
import {getCollectors, createCollector} from "$lib/server/database.js";

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  try {
    const collectors = await getCollectors();
    if (!collectors) {
      throw error(404, {message: "No collectors found"});
    }
    return json(collectors);
  } catch (err) {
    console.error("Failed to get collectors:", err);
    throw error(err.status || 500, {
      message: err.message || "Failed to get collectors",
      code: "COLLECTORS_FETCH_ERROR",
    });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function POST({request}) {
  try {
    const data = await request.json();
    const {name, description, maxOccurrencesPerDay} = data;

    if (!name?.trim()) {
      throw error(400, {
        message: "Name is required and cannot be empty",
        code: "INVALID_NAME",
      });
    }

    if (
      maxOccurrencesPerDay !== undefined &&
      maxOccurrencesPerDay !== -1 &&
      maxOccurrencesPerDay < 1
    ) {
      throw error(400, {
        message: "Max occurrences must be -1 (unlimited) or greater than 0",
        code: "INVALID_MAX_OCCURRENCES",
      });
    }

    const id = await createCollector({
      name: name.trim(),
      description: description?.trim(),
      maxOccurrencesPerDay: maxOccurrencesPerDay ?? -1,
    });

    return json({id, message: "Collector created successfully"});
  } catch (err) {
    console.error("Failed to create collector:", err);
    throw error(err.status || 500, {
      message: err.message || "Failed to create collector",
      code: err.code || "COLLECTOR_CREATE_ERROR",
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
