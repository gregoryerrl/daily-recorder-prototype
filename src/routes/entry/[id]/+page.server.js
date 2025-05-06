import {getEntry} from "$lib/server/database.js";
import {error} from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({params}) {
  const {id} = params;

  try {
    const entry = await getEntry(id);

    if (!entry) {
      throw error(404, "Entry not found");
    }

    return {
      entry,
    };
  } catch (err) {
    console.error(`Error loading entry ${id}:`, err);
    throw error(500, "Failed to load entry");
  }
}
