# New Entry Page Study (`entries/new/+page.svelte`)

## Component Overview

The new entry page provides a dynamic form interface for creating new entries for a specific collector. It loads the collector's fields and generates appropriate form inputs based on field types.

## Script Section Analysis

### Imports and Setup

```svelte
<script>
  import { Card, Button, Label, Input, ... } from 'flowbite-svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  export let data;
</script>
```

- Imports UI components from Flowbite-Svelte
- Imports navigation and lifecycle utilities
- Exports data prop for SvelteKit page data

### State Management

```svelte
let collectorId = '';
let date = '';
let fields = [];
let values = {};
let isSubmitting = false;
```

- Manages form state for entry data
- Tracks submission state
- Stores field definitions and values
- Uses object for field values to maintain field-value relationships

### Component Initialization

```svelte
onMount(async () => {
  const url = new URL(window.location.href);
  collectorId = url.searchParams.get('collectorId') || '';
  date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];

  if (collectorId) {
    const response = await fetch(`/api/collectors/${collectorId}/fields`);
    fields = await response.json();

    fields.forEach(field => {
      values[field.id] = field.type === 'checkbox' ? false : '';
    });
  }
});
```

- Extracts URL parameters for collector and date
- Fetches field definitions for the collector
- Initializes values object with appropriate defaults
- Handles checkbox fields differently

### Form Submission

```svelte
async function handleSubmit() {
  if (!collectorId || !date) return;

  isSubmitting = true;
  try {
    const fieldValues = Object.entries(values).map(([fieldId, value]) => ({
      fieldId,
      value: value.toString()
    }));

    const response = await fetch('/api/entries', {
      method: 'POST',
      body: JSON.stringify({
        collectorId,
        date,
        values: fieldValues
      })
    });

    if (response.ok) {
      goto('/');
    }
  } catch (error) {
    console.error('Failed to create entry:', error);
  } finally {
    isSubmitting = false;
  }
}
```

- Validates required data
- Transforms field values for API
- Posts entry data
- Handles errors and loading states
- Redirects on success

## Template Structure

### Form Layout

```svelte
<div class="max-w-2xl mx-auto">
  <form class="space-y-4">
    <!-- Form content -->
  </form>
</div>
```

- Centered layout with max width
- Vertical spacing between elements

### Date Input Section

```svelte
<div>
  <Label for="date" class="mb-2">Date</Label>
  <Input
    id="date"
    type="date"
    required
    bind:value={date}
  />
</div>
```

- Date selection field
- Required field validation

### Dynamic Field Generation

```svelte
{#each fields as field}
  <div>
    <Label for={field.id} class="mb-2">{field.label}</Label>

    {#if field.type === 'text'}
      <Input ... />
    {:else if field.type === 'number'}
      <Input type="number" ... />
    {:else if field.type === 'textarea'}
      <Textarea ... />
    {:else if field.type === 'checkbox'}
      <Checkbox ... />
    {/if}
  </div>
{/each}
```

- Renders appropriate input based on field type
- Handles different field types:
  - Text input
  - Number input
  - Textarea
  - Checkbox
- Maintains field requirements
- Custom placeholders

## Key Features

1. Dynamic form generation
2. Multiple input type support
3. Form validation
4. Error handling
5. Loading states
6. URL parameter handling
7. Default value initialization

## API Integration

- GET `/api/collectors/${id}/fields`: Fetches collector fields
- POST `/api/entries`: Creates new entry

## Dependencies

- Flowbite-Svelte for UI components
- SvelteKit for routing and navigation
- Tailwind CSS for styling
