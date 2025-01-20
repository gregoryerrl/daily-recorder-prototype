# New Collector Page Study (`collectors/new/+page.svelte`)

## Component Overview

The new collector page provides a form interface for creating new data collectors with customizable fields. It allows users to define collector properties and add multiple fields with different types and configurations.

## Script Section Analysis

### Imports and Setup

```svelte
<script>
  import { Card, Button, Label, Input, ... } from 'flowbite-svelte';
  import { goto } from '$app/navigation';
</script>
```

- Imports UI components from Flowbite-Svelte
- Imports navigation utility for redirection

### State Management

```svelte
let name = '';
let description = '';
let maxOccurrencesPerDay = -1;
let isSubmitting = false;
let fields = [];

const fieldTypes = [
  { value: 'text', name: 'Text' },
  { value: 'number', name: 'Number' },
  { value: 'textarea', name: 'Text Area' },
  { value: 'checkbox', name: 'Checkbox' }
];
```

- Manages form state for collector properties
- Tracks submission state
- Maintains list of fields
- Defines available field types

### Field Management Functions

```svelte
function addField() {
  fields = [...fields, {
    label: '',
    type: 'text',
    required: true
  }];
}

function removeField(index) {
  fields = fields.filter((_, i) => i !== index);
}
```

- Handles adding new fields with default values
- Handles removing fields by index
- Maintains field array immutability

### Form Submission

```svelte
async function handleSubmit() {
  if (!name || fields.length === 0) return;

  isSubmitting = true;
  try {
    // Create collector
    const collectorResponse = await fetch('/api/collectors', ...);
    const { id: collectorId } = await collectorResponse.json();

    // Create fields
    for (const field of fields) {
      await fetch(`/api/collectors/${collectorId}/fields`, ...);
    }

    goto('/collectors');
  } catch (error) {
    console.error('Failed to create collector:', error);
    alert(error.message);
  } finally {
    isSubmitting = false;
  }
}
```

- Validates form data
- Creates collector first
- Creates associated fields
- Handles errors and loading states
- Redirects on success

## Template Structure

### Form Layout

```svelte
<div class="w-[80vw] mx-auto">
  <form class="w-full flex gap-4">
    <div class="w-1/3">
      <!-- Collector Details -->
    </div>
    <div class="w-2/3">
      <!-- Fields Section -->
    </div>
  </form>
</div>
```

- Two-column layout
- Responsive design
- Clear section separation

### Collector Details Section

```svelte
<div class="space-y-4">
  <!-- Name Input -->
  <!-- Description Textarea -->
  <!-- Max Occurrences Input -->
</div>
```

- Basic collector information
- Required and optional fields
- Input validation

### Fields Section

```svelte
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  {#if fields.length === 0}
    <!-- Empty state -->
  {:else}
    {#each fields as field, index}
      <!-- Field Card -->
    {/each}
  {/if}
</div>
```

- Grid layout for fields
- Empty state handling
- Individual field cards
- Dynamic field management

### Field Card Structure

```svelte
<Card class="!p-4">
  <!-- Field Header -->
  <div class="space-y-4">
    <!-- Label Input -->
    <!-- Type Select -->
    <!-- Required Toggle -->
  </div>
</Card>
```

- Organized field properties
- Type selection
- Required field toggle
- Remove field option

## Key Features

1. Dynamic field management
2. Multiple field types support
3. Form validation
4. Error handling
5. Loading states
6. Responsive layout
7. Clear user feedback

## API Integration

- POST `/api/collectors`: Creates new collector
- POST `/api/collectors/${id}/fields`: Creates fields for collector

## Dependencies

- Flowbite-Svelte for UI components
- SvelteKit for routing and navigation
- Tailwind CSS for styling
