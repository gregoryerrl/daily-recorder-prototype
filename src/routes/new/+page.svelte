<script>
  import { enhance } from '$app/forms';
  import { showToast } from '$lib/stores/ui.js';
  
  /** @type {import('./$types').PageData} */
  export let data;
  
  /** @type {import('./$types').ActionData} */
  export let form;
  
  let entry = {
    title: '',
    content: '',
    category_id: ''
  };
  
  let isSubmitting = false;

  function enhanceWithLoading() {
    console.log('New entry form enhance called');
    
    isSubmitting = true;
    
    return async () => {
      console.log('New entry form submission complete');
      isSubmitting = false;
      
      // If we got an error message, show it
      if (form?.message && !form.success) {
        showToast(form.message, 'error');
      }
      
      // No need to handle success case with redirect
      // SvelteKit will handle the redirect automatically
    };
  }
</script>

<svelte:head>
  <title>New Entry - Daily Recorder</title>
</svelte:head>

<div class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-6">Create New Entry</h1>
  
  <div class="max-w-2xl mx-auto bg-white p-6 rounded shadow">
    <form method="POST" use:enhance={enhanceWithLoading}>
      <div class="mb-4">
        <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          bind:value={entry.title}
          required
        />
      </div>
      
      <div class="mb-4">
        <label for="category_id" class="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category_id"
          name="category_id"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          bind:value={entry.category_id}
        >
          <option value="">-- Select Category --</option>
          {#each data.categories as category}
            <option value={category.id}>{category.name}</option>
          {/each}
        </select>
      </div>
      
      <div class="mb-4">
        <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          id="content"
          name="content"
          rows="8"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          bind:value={entry.content}
          required
        ></textarea>
      </div>
      
      {#if form?.message && !form.success}
        <div class="mb-4 p-2 text-sm text-red-700 bg-red-100 rounded">
          {form.message}
        </div>
      {/if}
      
      <div class="flex justify-end space-x-4">
        <a href="/" class="px-4 py-2 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          Cancel
        </a>
        <button 
          type="submit" 
          class="px-4 py-2 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 flex items-center" 
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
      </div>
    </form>
  </div>
</div> 