<!-- Dashboard page -->
<script>
  import { Card, Button, Heading, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Datepicker, Select } from 'flowbite-svelte';
  import { onMount } from 'svelte';

  /** @type {import('./$types').PageData} */
  export let data;

  let collectors = [];
  let selectedDate = new Date();
  // Set the time to noon UTC to avoid timezone issues
  selectedDate.setUTCHours(12, 0, 0, 0);
  let formattedDate = formatDateForAPI(selectedDate);
  let selectedCollector = null;
  let entries = [];
  let fields = [];
  let isLoading = false;

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

  onMount(async () => {
    const response = await fetch('/api/collectors');
    collectors = await response.json();
    if (collectors.length > 0) {
      selectedCollector = collectors[0];
      await Promise.all([loadFields(), loadEntries()]);
    }
  });

  function formatDateForAPI(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function formatValue(field, value) {
    if (!value) return '-';
    
    switch (field.type) {
      case 'checkbox':
        return value.value_text === 'true' ? '✓' : '✗';
      case 'number':
        return Number(value.value_text).toLocaleString();
      default:
        return value.value_text;
    }
  }

  async function handleDateChange(event) {
    const newDate = new Date(event.detail);
    newDate.setUTCHours(12, 0, 0, 0);
    selectedDate = newDate;
    formattedDate = formatDateForAPI(selectedDate);
    if (selectedCollector) {
      await loadEntries();
    }
  }

  async function loadFields() {
    if (!selectedCollector) return;
    const response = await fetch(`/api/collectors/${selectedCollector.id}/fields`);
    fields = await response.json();
  }

  async function loadEntries() {
    if (!selectedCollector) return;
    isLoading = true;
    try {
      const response = await fetch(`/api/entries?collectorId=${selectedCollector.id}&date=${formattedDate}`);
      if (!response.ok) {
        throw new Error('Failed to load entries');
      }
      entries = await response.json();
    } catch (error) {
      console.error('Failed to load entries:', error);
      entries = [];
    } finally {
      isLoading = false;
    }
  }

  async function handleCollectorChange(event) {
    const newCollectorId = event.target.value;
    selectedCollector = collectors.find((c) => c.id === newCollectorId);
    await Promise.all([loadFields(), loadEntries()]);
  }
</script>

<div class="flex flex-col w-full gap-6">
  <!-- Top Bar -->
  <div class="w-full">
    <div class="flex items-center justify-around">
      <div class="flex items-center gap-4 flex-1">
        <span class="text-gray-500">Collector:</span>
        <Select
          class="w-64"
          items={collectorOptions}
          bind:value={selectedCollectorId}
          on:change={handleCollectorChange}
        />
        <div class="w-80">
          <Datepicker
            bind:value={selectedDate}
          />
        </div>
      </div>
      {#if selectedCollector}
        <Button href={`/entries/new?collectorId=${selectedCollector.id}&date=${formattedDate}`}>
          Add Entry
        </Button>
      {/if}
    </div>
  </div>

  <!-- Main Content -->
  <div class="w-full">
    {#if !selectedCollector}
      <p class="text-gray-500">Select a collector to view entries</p>
    {:else}
      <Heading tag="h2" class="text-2xl mb-6 font-thin">Records for <span class="font-normal">{formatDate(selectedDate)}</span></Heading>
      
      {#if isLoading}
        <p class="text-gray-500">Loading entries...</p>
      {:else if entries.length === 0}
        <p class="text-gray-500">No entries found for this date. Add your first entry!</p>
      {:else}
        <Table>
          <TableHead>
            <TableHeadCell>Time</TableHeadCell>
            {#each fields as field}
              <TableHeadCell>{field.label}</TableHeadCell>
            {/each}
          </TableHead>
          <TableBody>
            {#each entries as entry}
              <TableBodyRow>
                <TableBodyCell>
                  {new Date(entry.created_at).toLocaleTimeString()}
                </TableBodyCell>
                {#each fields as field}
                  <TableBodyCell>
                    {formatValue(field, entry.values.find((v) => v.field_id === field.id))}
                  </TableBodyCell>
                {/each}
              </TableBodyRow>
            {/each}
          </TableBody>
        </Table>
      {/if}
    {/if}
  </div>
</div>
