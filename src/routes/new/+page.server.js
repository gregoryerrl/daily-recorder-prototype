import {getCategories, createEntry} from "$lib/server/database.js";
import {error, redirect} from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  try {
    const categories = await getCategories();

    return {
      categories,
    };
  } catch (err) {
    console.error("Error loading categories:", err);
    throw error(500, "Failed to load categories");
  }
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({request}) => {
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

      // Show success message before redirecting
      // To actually show the message, we'd need client-side flash messages
      // which is beyond the scope of our current implementation

      // Redirect to home page on success
      throw redirect(303, "/");
    } catch (err) {
      if (err instanceof Response) throw err; // Rethrow redirect

      console.error("Error creating entry:", err);
      return {
        success: false,
        message: `Failed to create entry: ${err.message}`,
      };
    }
  },
};
