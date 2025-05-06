import {getCategories, createCategory} from "$lib/server/database.js";
import {error} from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  try {
    // This is another example of a server load function
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
  createCategory: async ({request}) => {
    const formData = await request.formData();
    const name = formData.get("name");

    if (!name) {
      return {
        success: false,
        message: "Category name is required",
      };
    }

    try {
      const categoryId = await createCategory(name);
      console.log("Created category with ID:", categoryId);
      return {
        success: true,
        message: "Category added successfully",
        categoryId,
      };
    } catch (err) {
      console.error("Error creating category:", err);

      if (err.message === "Category already exists") {
        return {
          success: false,
          message: "A category with this name already exists",
        };
      }

      return {
        success: false,
        message: `Failed to create category: ${err.message}`,
      };
    }
  },
};
