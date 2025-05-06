<script>
  import { slide } from 'svelte/transition';
  import { onMount } from 'svelte';
  
  export let message = '';
  export let type = 'success'; // success, error, info
  export let duration = 3000; // milliseconds
  export let show = true;
  
  let visible = show;
  
  $: bgColor = type === 'success' 
    ? 'bg-green-100 border-green-400 text-green-700' 
    : type === 'error' 
      ? 'bg-red-100 border-red-400 text-red-700' 
      : 'bg-blue-100 border-blue-400 text-blue-700';
  
  onMount(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        visible = false;
      }, duration);
      
      return () => clearTimeout(timer);
    }
  });
</script>

{#if visible && message}
  <div 
    transition:slide={{ duration: 300 }}
    class="fixed top-5 right-5 z-50 px-4 py-3 rounded border {bgColor} max-w-md flex items-center shadow-lg"
    role="alert"
  >
    <div class="flex-grow">
      {message}
    </div>
    <button 
      type="button" 
      class="ml-4" 
      on:click={() => visible = false}
      aria-label="Close notification"
    >
      <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path 
          fill-rule="evenodd" 
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
          clip-rule="evenodd"
        ></path>
      </svg>
    </button>
  </div>
{/if} 