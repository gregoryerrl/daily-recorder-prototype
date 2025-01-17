<!-- Field management page -->
<script>
  import { Card, Button, Label, Input, Select, Heading, Toggle } from 'flowbite-svelte';
  import { onMount } from 'svelte';

  /** @type {import('./$types').PageData} */
  export let data;

  let fields = [];
  let collector = null;
  let showNewFieldForm = false;

  // New field form data
  let newField = {
    label: '',
    type: 'text',
    required: true,
    settings: {}
  };

  const fieldTypes = [
    { value: 'text', name: 'Text' },
    { value: 'number', name: 'Number' },
    { value: 'textarea', name: 'Text Area' },
    { value: 'checkbox', name: 'Checkbox' }
  ];

  onMount(async () => {
    const collectorId = window.location.pathname.split('/')[2];
    const [collectorResponse, fieldsResponse] = await Promise.all([
      fetch(`/api/collectors/${collectorId}`),
      fetch(`/api/collectors/${collectorId}/fields`)
    ]);

    collector = await collectorResponse.json();
    fields = await fieldsResponse.json();
  });

  async function handleSubmit() {
    const collectorId = window.location.pathname.split('/')[2];
    
    try {
      const response = await fetch(`/api/collectors/${collectorId}/fields`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newField)
      });

      if (response.ok) {
        const { id } = await response.json();
        fields = [...fields, { ...newField, id }];
        showNewFieldForm = false;
        newField = {
          label: '',
          type: 'text',
          required: true,
          settings: {}
        };
      }
    } catch (error) {
      console.error('Failed to create field:', error);
    }
  }
</script>

<div class="max-w-4xl mx-auto">
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <Heading tag="h2" class="text-2xl">{collector?.name || 'Loading...'} Fields</Heading>
        <p class="text-gray-500">Manage the fields for this collector</p>
      </div>
      <Button on:click={() => showNewFieldForm = !showNewFieldForm}>
        {showNewFieldForm ? 'Cancel' : 'Add Field'}
      </Button>
    </div>

    {#if showNewFieldForm}
      <form on:submit|preventDefault={handleSubmit} class="space-y-4 mb-8 p-4 bg-gray-50 rounded-lg">
        <Heading tag="h3" class="text-lg">New Field</Heading>

        <div>
          <Label for="label" class="mb-2">Label</Label>
          <Input
            id="label"
            required
            bind:value={newField.label}
            placeholder="Enter field label"
          />
        </div>

        <div>
          <Label for="type" class="mb-2">Type</Label>
          <Select id="type" bind:value={newField.type} items={fieldTypes} />
        </div>

        <div class="flex items-center gap-2">
          <Toggle bind:checked={newField.required} />
          <Label>Required Field</Label>
        </div>

        <div class="flex justify-end">
          <Button type="submit">Add Field</Button>
        </div>
      </form>
    {/if}

    {#if fields.length === 0}
      <p class="text-gray-500">No fields added yet. Add your first field to start collecting data.</p>
    {:else}
      <div class="space-y-4">
        {#each fields as field}
          <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 class="font-medium">{field.label}</h3>
              <p class="text-sm text-gray-500">
                Type: {fieldTypes.find(t => t.value === field.type)?.name || field.type}
                {#if field.required}
                  <span class="ml-2 text-red-500">Required</span>
                {/if}
              </p>
            </div>
            <!-- TODO: Add edit/delete actions if needed -->
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div> 