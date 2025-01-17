import {json, error} from "@sveltejs/kit";
import {getCollector, deleteCollector} from "$lib/server/database.js";
import {db} from "$lib/server/database.js";

/** @type {import('./$types').RequestHandler} */
export async function GET({params}) {
  try {
    if (!params.id?.trim()) {
      throw error(400, {
        message: "Collector ID is required",
        code: "INVALID_ID",
      });
    }

    const collector = await getCollector(params.id);
    if (!collector) {
      throw error(404, {
        message: "Collector not found",
        code: "COLLECTOR_NOT_FOUND",
      });
    }

    return json(collector);
  } catch (err) {
    console.error("Failed to get collector:", err);
    throw error(err.status || 500, {
      message: err.message || "Failed to get collector",
      code: err.code || "COLLECTOR_FETCH_ERROR",
    });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      Allow: "GET, OPTIONS",
    },
  });
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({params}) {
  const {id} = params;

  try {
    await deleteCollector(id);
    return new Response(null, {status: 204});
  } catch (error) {
    console.error("Failed to delete collector:", error);
    if (error.status) throw error;
    return json({error: "Failed to delete collector"}, {status: 500});
  }
}
