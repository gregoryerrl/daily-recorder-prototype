<script>
  import { enhance } from '$app/forms';
  import { showToast } from '$lib/stores/ui.js';
  
  /** @type {import('./$types').PageData} */
  export let data;
  
  /** @type {import('./$types').ActionData} */
  export let form;
  
  let newCategory = '';
  let isSubmitting = false;
  
  function enhanceWithLoading() {
    console.log('Categories enhance function called');
    
    isSubmitting = true;
    
    return async ({ update }) => {
      console.log('Categories form submission complete');
      isSubmitting = false;
      
      if (form?.success) {
        // Reset form on success
        newCategory = '';
      }
      
      // Give time for UI to update before potentially refreshing
      setTimeout(() => {
        if (form?.success) {
          showToast('Category added successfully!', 'success');
          window.location.reload();
        } else if (form?.message) {
          showToast(form.message, 'error');
        }
      }, 100);
    };
  }
</script>

<svelte:head>
  <title>Categories - Daily Recorder</title>
</svelte:head>

<div class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-6">Categories</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Left sidebar with form -->
    <div class="bg-white p-4 rounded shadow">
      <h2 class="text-xl font-semibold mb-4">Add New Category</h2>
      
      <form method="POST" action="?/createCategory" use:enhance={enhanceWithLoading}>
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700">Category Name</label>
          <input
            type="text"
            id="name"
            name="name"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            bind:value={newCategory}
            required
          />
        </div>
        
        {#if form?.message}
          <div class="mb-4 p-2 text-sm {form.success ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'} rounded">
            {form.message}
          </div>
        {/if}
        
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
            Adding...
          {:else}
            Add Category
          {/if}
        </button>
      </form>
    </div>
    
    <!-- Main content area with categories -->
    <div class="md:col-span-2">
      <h2 class="text-xl font-semibold mb-4">All Categories</h2>
      
      {#if data.categories.length === 0}
        <div class="bg-white p-4 rounded shadow text-center">
          <p>No categories yet. Add your first category!</p>
        </div>
      {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {#each data.categories as category}
            <div class="bg-white p-4 rounded shadow">
              <h3 class="text-lg font-medium">{category.name}</h3>
              <div class="mt-2 text-xs text-gray-500">
                Created: {new Date(category.created_at).toLocaleDateString()}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div> 