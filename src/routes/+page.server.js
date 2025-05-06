import {getEntries, getCategories, createEntry} from "$lib/server/database.js";
import {error} from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  try {
    // This function runs on the server
    // Data returned here is available to the page component
    const [entries, categories] = await Promise.all([
      getEntries(),
      getCategories(),
    ]);

    return {
      entries,
      categories,
    };
  } catch (err) {
    console.error("Error loading data:", err);
    throw error(500, "Failed to load entries");
  }
}

/** @type {import('./$types').Actions} */
export const actions = {
  createEntry: async ({request}) => {
    const formData = await request.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const categoryId = formData.get("category_id");

    if (!title || !content) {
      return {
        success: false,
        message: "Title and content are required",
      };
    }

    try {
      const entryId = await createEntry(title, content, categoryId || null);
      console.log("Created entry with ID:", entryId);
      return {
        success: true,
        message: "Entry created successfully",
        entryId,
      };
    } catch (err) {
      console.error("Error creating entry:", err);
      return {
        success: false,
        message: `Failed to create entry: ${err.message}`,
      };
    }
  },
};
