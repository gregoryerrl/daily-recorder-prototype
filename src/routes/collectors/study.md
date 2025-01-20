# Collectors Page Study (`collectors/+page.svelte`)

## Component Overview

The collectors page manages the list of data collectors in the application. It provides functionality to view, create, and delete collectors, serving as a management interface for data collection configurations.

## Script Section Analysis

### Imports and Setup

```svelte
<script>
  import { Card, Button, Heading, Table, ... } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  export let data;
</script>
```

- Imports UI components from Flowbite-Svelte
- Imports Svelte lifecycle and navigation utilities
- Exports data prop for SvelteKit page data

### State Management

```svelte
let collectors = [];
let isLoading = false;
```

- Maintains list of collectors
- Tracks loading state for UI feedback

### Data Loading

```svelte
onMount(async () => {
  await loadCollectors();
});

async function loadCollectors() {
  isLoading = true;
  try {
    const response = await fetch('/api/collectors');
    collectors = await response.json();
  } catch (error) {
    console.error('Failed to load collectors:', error);
    collectors = [];
  } finally {
    isLoading = false;
  }
}
```

- Loads collectors on component mount
- Handles loading states and errors
- Updates collectors array with fetched data

### Data Management Functions

```svelte
async function deleteCollector(collector) {
  if (!confirm(`Are you sure you want to delete "${collector.name}"?`)) {
    return;
  }

  try {
    const response = await fetch(`/api/collectors/${collector.id}`, {
      method: 'DELETE'
    });
    await loadCollectors();
  } catch (error) {
    console.error('Failed to delete collector:', error);
    alert('Failed to delete collector. Please try again.');
  }
}
```

- Handles collector deletion with confirmation
- Makes DELETE request to API
- Reloads collector list on successful deletion
- Provides error feedback

## Template Structure

### Header Section

```svelte
<div class="flex justify-between items-center">
  <Heading tag="h1" class="text-3xl">Collectors</Heading>
  <Button href="/collectors/new">New Collector</Button>
</div>
```

- Displays page title
- Provides button to create new collectors

### Main Content Section

```svelte
{#if isLoading}
  <p class="text-gray-500">Loading collectors...</p>
{:else if collectors.length === 0}
  <p class="text-gray-500">No collectors found. Create your first collector!</p>
{:else}
  <Table>
    <!-- Table structure -->
  </Table>
{/if}
```

- Conditional rendering based on state
- Loading indicator
- Empty state message
- Tabular display of collectors

### Table Structure

```svelte
<Table>
  <TableHead>
    <TableHeadCell>Name</TableHeadCell>
    <TableHeadCell>Description</TableHeadCell>
    <TableHeadCell class="w-48">Actions</TableHeadCell>
  </TableHead>
  <TableBody>
    {#each collectors as collector}
      <!-- Collector row -->
    {/each}
  </TableBody>
</Table>
```

- Displays collector information in organized columns
- Action buttons for each collector
- Responsive table layout

## Key Features

1. CRUD operations for collectors
2. Loading states and error handling
3. Confirmation dialogs for destructive actions
4. Clean and organized data presentation
5. Navigation to related pages (new collector, fields)

## API Integration

- GET `/api/collectors`: Fetches collector list
- DELETE `/api/collectors/${id}`: Deletes specific collector

## Dependencies

- Flowbite-Svelte for UI components
- SvelteKit for routing and navigation
- Tailwind CSS for styling
