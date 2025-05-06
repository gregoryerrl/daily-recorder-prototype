<script>
  import { enhance } from '$app/forms';
  import { showToast } from '$lib/stores/ui.js';
  
  /** @type {import('./$types').PageData} */
  export let data;
  
  /** @type {import('./$types').ActionData} */
  export let form;
  
  let newEntry = {
    title: '',
    content: '',
    category_id: ''
  };
  
  let isSubmitting = false;
  
  // Bare bones enhance function - simplest possible implementation
  function submitForm() {
    console.log('Enhance function called');
    
    isSubmitting = true;
    
    return async ({ update }) => {
      console.log('Form submission complete');
      isSubmitting = false;
      
      window.location.reload();
    };
  }
</script>

<svelte:head>
  <title>Daily Recorder</title>
</svelte:head>

<div class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-6">Daily Recorder</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Left sidebar with form -->
    <div class="bg-white p-4 rounded shadow">
      <h2 class="text-xl font-semibold mb-4">Add New Entry</h2>
      
      <form method="POST" action="?/createEntry" use:enhance={submitForm}>
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            bind:value={newEntry.title}
            required
          />
        </div>
        
        <div class="mb-4">
          <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            id="content"
            name="content"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            bind:value={newEntry.content}
            required
          ></textarea>
        </div>
        
        <div class="mb-4">
          <label for="category_id" class="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category_id"
            name="category_id"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            bind:value={newEntry.category_id}
          >
            <option value="">-- Select Category --</option>
            {#each data.categories as category}
              <option value={category.id}>{category.name}</option>
            {/each}
          </select>
        </div>
        
        <button 
          type="submit" 
          class="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 flex justify-center items-center" 
          disabled={isSubmitting}
        >
          {#if isSubmitting}
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          {:else}
            Save Entry
          {/if}
        </button>
      </form>
    </div>
    
    <!-- Main content area with entries -->
    <div class="md:col-span-2">
      <h2 class="text-xl font-semibold mb-4">Recent Entries</h2>
      
      {#if data.entries.length === 0}
        <div class="bg-white p-4 rounded shadow text-center">
          <p>No entries yet. Add your first entry!</p>
        </div>
      {:else}
        <div class="space-y-4">
          {#each data.entries as entry}
            <div class="bg-white p-4 rounded shadow">
              <div class="flex justify-between items-start">
                <a href="/entry/{entry.id}" class="text-lg font-medium hover:text-indigo-600">{entry.title}</a>
                {#if entry.category_name}
                  <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {entry.category_name}
                  </span>
                {/if}
              </div>
              <p class="mt-2 text-gray-700">{entry.content}</p>
              <div class="mt-2 text-xs text-gray-500">
                {new Date(entry.created_at).toLocaleString()}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
