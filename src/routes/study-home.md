# Home Page Study (`+page.svelte`)

## Component Overview

The home page serves as the main dashboard for viewing and managing daily records. It provides a dynamic interface for selecting collectors and dates, and displays entries in a tabular format.

## Script Section Analysis

### Imports and Setup

```svelte
<script>
  import { Card, Button, Heading, Table, ... } from 'flowbite-svelte';
  import { onMount } from 'svelte';

  export let data;
</script>
```

- Imports UI components from Flowbite-Svelte
- Imports Svelte's `onMount` lifecycle function
- Exports data prop for SvelteKit page data

### State Management

```svelte
let collectors = [];
let selectedDate = new Date();
let formattedDate = formatDateForAPI(selectedDate);
let selectedCollector = null;
let entries = [];
let fields = [];
let isLoading = false;
```

- Manages local state for collectors, dates, entries, and UI state
- Initializes date to current date with UTC noon time to avoid timezone issues

### Reactive Declarations

```svelte
$: collectorOptions = collectors.map((c) => ({
  value: c.id,
  name: c.name
}));

$: selectedCollectorId = selectedCollector?.id || '';

$: if (selectedDate) {
  formattedDate = formatDateForAPI(selectedDate);
  if (selectedCollector) {
    loadEntries();
  }
}
```

- Transforms collectors into select options format
- Maintains selected collector ID
- Automatically reloads entries when date changes

### Helper Functions

1. `formatDateForAPI(date)`: Formats date for API requests (YYYY-MM-DD)
2. `formatDate(date)`: Formats date for display
3. `formatValue(field, value)`: Formats field values based on their type
4. `handleDateChange(event)`: Handles date picker changes
5. `handleCollectorChange(event)`: Handles collector selection changes

### Data Loading Functions

1. `loadFields()`: Fetches fields for selected collector
2. `loadEntries()`: Fetches entries for selected date and collector
3. `onMount`: Initial data loading on component mount

## Template Structure

### Top Bar Section

```svelte
<div class="flex items-center justify-around">
  <!-- Collector selector -->
  <!-- Date picker -->
  <!-- Add Entry button -->
</div>
```

- Flexible layout for controls
- Conditional rendering of Add Entry button

### Main Content Section

```svelte
<div class="w-full">
  <!-- Conditional rendering based on state -->
  <!-- Table of entries -->
</div>
```

- Shows appropriate UI based on selection state
- Displays entries in a responsive table

## Key Features

1. Dynamic data loading
2. Interactive date and collector selection
3. Formatted data display
4. Loading states
5. Empty state handling

## API Integration

- `/api/collectors`: Fetches collector list
- `/api/collectors/${id}/fields`: Fetches collector fields
- `/api/entries`: Fetches entries with date and collector filters

## Dependencies

- Flowbite-Svelte for UI components
- SvelteKit for routing and data handling
- Tailwind CSS for styling
