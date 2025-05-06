# Daily Recorder - SvelteKit SSR Demo

A simple application to demonstrate Server-Side Rendering (SSR) concepts in SvelteKit.

## Features

- Server-side data loading with `load` functions
- Form actions for data creation
- Database integration with Turso SQL
- SSR optimized pages

## SSR Concepts Demonstrated

1. **Server-Side Rendering**: All pages are rendered on the server first, providing better SEO and faster initial loads.

2. **Server Load Functions**: Each page uses a `+page.server.js` file with a `load` function that fetches data on the server before the page is rendered.

3. **Form Actions**: SvelteKit's form actions are used for data submission, providing progressive enhancement with JavaScript and fallback to standard form submissions.

4. **Data Fetching**: Database queries are executed on the server, not exposing the database to the client.

5. **Route Parameters**: The `/entry/[id]` route demonstrates how to use dynamic parameters in routes.

## Project Structure

- `src/lib/server/database.js` - Database configuration and query functions
- `src/lib/server/schema.sql` - SQL schema definition
- `src/routes/+page.server.js` - Server load function for the main page
- `src/routes/+page.svelte` - UI component for the main page
- `src/routes/categories/` - Pages related to categories
- `src/routes/entry/[id]/` - Dynamic route for viewing individual entries
- `src/routes/new/` - Page for creating new entries

## Environment Variables

The project uses the following environment variables:

- `TURSO_DB_URL`: URL of the Turso database
- `TURSO_DB_AUTH_TOKEN`: Authentication token for the Turso database

## Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
