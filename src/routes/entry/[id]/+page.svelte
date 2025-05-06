<script>
  /** @type {import('./$types').PageData} */
  export let data;
  
  const { entry } = data;
  const formattedDate = new Date(entry.created_at).toLocaleString();
</script>

<svelte:head>
  <title>{entry.title} - Daily Recorder</title>
</svelte:head>

<div class="container mx-auto p-4">
  <div class="max-w-3xl mx-auto bg-white p-6 rounded shadow">
    <div class="mb-4 flex justify-between items-center">
      <h1 class="text-3xl font-bold">{entry.title}</h1>
      <div class="text-sm text-gray-500">{formattedDate}</div>
    </div>
    
    <div class="prose prose-lg max-w-none">
      <p>{entry.content}</p>
    </div>
    
    <div class="mt-8 flex justify-end">
      <a href="/" class="px-4 py-2 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
        Back to Home
      </a>
    </div>
  </div>
</div> 