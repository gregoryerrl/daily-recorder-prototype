import {initDatabase, testConnection} from "$lib/server/database.js";

// Initialize database when server starts
try {
  console.log("Testing database connection...");
  await testConnection();
  console.log("Initializing database tables...");
  await initDatabase();
  console.log("Database setup complete");
} catch (err) {
  console.error("Database setup failed:", err);
  // Don't throw here, let the server start anyway
  // The error handling in the API routes will handle failures
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({event, resolve}) {
  if (event.url.pathname.startsWith("/api/")) {
    // Handle CORS for API routes if needed
    const response = await resolve(event);
    return new Response(response.body, {
      ...response,
      headers: {
        ...response.headers,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }
  return resolve(event);
}
