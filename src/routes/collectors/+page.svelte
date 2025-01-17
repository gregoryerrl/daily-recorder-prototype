<!-- Collectors page -->
<script>
  import { Card, Button, Heading, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  /** @type {import('./$types').PageData} */
  export let data;

  let collectors = [];
  let isLoading = false;

  onMount(async () => {
    await loadCollectors();
  });

  async function loadCollectors() {
    isLoading = true;
    try {
      const response = await fetch('/api/collectors');
      if (!response.ok) {
        throw new Error('Failed to load collectors');
      }
      collectors = await response.json();
    } catch (error) {
      console.error('Failed to load collectors:', error);
      collectors = [];
    } finally {
      isLoading = false;
    }
  }

  async function deleteCollector(collector) {
    if (!confirm(`Are you sure you want to delete "${collector.name}"?\nThis will permanently delete all entries for this collector.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/collectors/${collector.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete collector');
      }

      await loadCollectors();
    } catch (error) {
      console.error('Failed to delete collector:', error);
      alert('Failed to delete collector. Please try again.');
    }
  }
</script>

<div class="flex flex-col w-full gap-6">
  <div class="flex justify-between items-center">
    <Heading tag="h1" class="text-3xl">Collectors</Heading>
    <Button href="/collectors/new">New Collector</Button>
  </div>

  {#if isLoading}
    <p class="text-gray-500">Loading collectors...</p>
  {:else if collectors.length === 0}
    <p class="text-gray-500">No collectors found. Create your first collector!</p>
  {:else}
    <Table>
      <TableHead>
        <TableHeadCell>Name</TableHeadCell>
        <TableHeadCell>Description</TableHeadCell>
        <TableHeadCell class="w-48">Actions</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each collectors as collector}
          <TableBodyRow>
            <TableBodyCell>{collector.name}</TableBodyCell>
            <TableBodyCell>{collector.description || '-'}</TableBodyCell>
            <TableBodyCell>
              <div class="flex gap-2">
                <Button href={`/collectors/${collector.id}/fields`} size="sm">Fields</Button>
                <Button color="red" size="sm" on:click={() => deleteCollector(collector)}>Delete</Button>
              </div>
            </TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  {/if}
</div> 