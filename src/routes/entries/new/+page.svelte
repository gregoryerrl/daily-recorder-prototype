<!-- New entry form -->
<script>
  import { Card, Button, Label, Input, Textarea, Heading, Checkbox } from 'flowbite-svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  /** @type {import('./$types').PageData} */
  export let data;

  let collectorId = '';
  let date = '';
  let fields = [];
  let values = {};
  let isSubmitting = false;

  onMount(async () => {
    const url = new URL(window.location.href);
    collectorId = url.searchParams.get('collectorId') || '';
    date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];

    if (collectorId) {
      const response = await fetch(`/api/collectors/${collectorId}/fields`);
      fields = await response.json();
      
      // Initialize values object
      fields.forEach(field => {
        values[field.id] = field.type === 'checkbox' ? false : '';
      });
    }
  });

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
        headers: {
          'Content-Type': 'application/json'
        },
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
</script>

<div class="max-w-2xl mx-auto">
  <div>
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <Heading tag="h2" class="text-2xl mb-4">New Entry</Heading>

      <div>
        <Label for="date" class="mb-2">Date</Label>
        <Input
          id="date"
          type="date"
          required
          bind:value={date}
        />
      </div>

      {#each fields as field}
        <div>
          <Label for={field.id} class="mb-2">{field.label}</Label>
          
          {#if field.type === 'text'}
            <Input
              id={field.id}
              required={field.required}
              bind:value={values[field.id]}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
          {:else if field.type === 'number'}
            <Input
              id={field.id}
              type="number"
              required={field.required}
              bind:value={values[field.id]}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
          {:else if field.type === 'textarea'}
            <Textarea
              id={field.id}
              required={field.required}
              bind:value={values[field.id]}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              rows="3"
            />
          {:else if field.type === 'checkbox'}
            <Checkbox
              id={field.id}
              required={field.required}
              bind:checked={values[field.id]}
            />
          {/if}
        </div>
      {/each}

      <div class="flex justify-end gap-4">
        <Button href="/" color="light">Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Entry'}
        </Button>
      </div>
    </form>
  </div>
</div> 