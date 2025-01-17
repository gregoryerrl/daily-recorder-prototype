<!-- New collector form with fields -->
<script>
  import { Card, Button, Label, Input, Textarea, Heading, Select, Toggle } from 'flowbite-svelte';
  import { goto } from '$app/navigation';

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

  async function handleSubmit() {
    if (!name || fields.length === 0) return;
    
    isSubmitting = true;
    try {
      // Create collector
      const collectorResponse = await fetch('/api/collectors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          description,
          maxOccurrencesPerDay: parseInt(maxOccurrencesPerDay)
        })
      });

      if (!collectorResponse.ok) {
        const error = await collectorResponse.json();
        throw new Error(error.message || 'Failed to create collector');
      }

      const { id: collectorId } = await collectorResponse.json();

      // Create fields
      for (const field of fields) {
        const fieldResponse = await fetch(`/api/collectors/${collectorId}/fields`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(field)
        });

        if (!fieldResponse.ok) {
          const error = await fieldResponse.json();
          throw new Error(error.message || 'Failed to create field');
        }
      }

      goto('/collectors');
    } catch (error) {
      console.error('Failed to create collector:', error);
      alert(error.message);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="w-[80vw] mx-auto">
  <div class="w-full">
    <form on:submit|preventDefault={handleSubmit} class="w-full flex gap-4">
      <div class="w-1/3">
          <Heading tag="h2" class="text-2xl mb-4">Create New Collector</Heading>
          <!-- Collector Details -->
          <div class="space-y-4">
            <Heading tag="h3" class="text-lg">Collector Details</Heading>
          
            <div>
              <Label for="name" class="mb-2">Name</Label>
              <Input
                id="name"
                required
                bind:value={name}
                placeholder="Enter collector name"
              />
            </div>
            <div>
              <Label for="description" class="mb-2">Description</Label>
              <Textarea
                id="description"
                bind:value={description}
                placeholder="Enter collector description"
                rows="3"
              />
            </div>
            <div>
              <Label for="maxOccurrences" class="mb-2">Max Occurrences Per Day</Label>
              <Input
                id="maxOccurrences"
                type="number"
                bind:value={maxOccurrencesPerDay}
                min="-1"
                placeholder="Enter max occurrences (-1 for unlimited)"
              />
              <p class="text-sm text-gray-500 mt-1">
                Set to -1 for unlimited entries per day
              </p>
            </div>
          </div>
          <div class="flex justify-end gap-4">
            <Button href="/collectors" color="light">Cancel</Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !name || fields.length === 0}
            >
              {isSubmitting ? 'Creating...' : 'Create Collector'}
            </Button>
          </div>
      </div>

      <!-- Fields Section -->
      <div class="space-y-4 w-2/3">
        <div class="flex justify-between items-center">
          <Heading tag="h3" class="text-lg">Fields</Heading>
          <Button type="button" size="xs" on:click={addField}>Add Field</Button>
        </div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    
            {#if fields.length === 0}
              <p class="text-gray-500">No fields added yet. Add at least one field to collect data.</p>
            {:else}
              {#each fields as field, index}
                <Card class="!p-4">
                  <div class="flex justify-between items-start mb-4">
                    <Heading tag="h4" class="text-md">Field {index + 1}</Heading>
                    <Button
                      type="button"
                      color="red"
                      size="xs"
                      on:click={() => removeField(index)}
                    >
                      Remove
                    </Button>
                  </div>
    
                  <div class="space-y-4">
                    <div>
                      <Label for="field-label-{index}" class="mb-2">Label</Label>
                      <Input
                        id="field-label-{index}"
                        required
                        bind:value={field.label}
                        placeholder="Enter field label"
                      />
                    </div>
    
                    <div>
                      <Label for="field-type-{index}" class="mb-2">Type</Label>
                      <Select
                        id="field-type-{index}"
                        items={fieldTypes}
                        bind:value={field.type}
                      />
                    </div>
    
                    <div class="flex items-center gap-2">
                      <Toggle bind:checked={field.required} />
                      <Label>Required Field</Label>
                    </div>
                  </div>
                </Card>
              {/each}
            {/if}
</div>
      </div>

      
    </form>
</div>
</div> 