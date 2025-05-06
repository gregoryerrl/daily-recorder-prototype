<script>
  import { loadingStates } from '$lib/stores/ui.js';
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';
  
  // Debug logs
  const logs = writable([]);
  const maxLogs = 10;
  let visible = false;
  let activePanelTab = 'logs';
  
  // Intercept console logs for debugging
  onMount(() => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    
    console.log = function(...args) {
      originalConsoleLog.apply(console, args);
      logs.update(prevLogs => {
        const newLogs = [...prevLogs, { type: 'log', content: args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '), time: new Date() }];
        return newLogs.slice(-maxLogs);
      });
    };
    
    console.error = function(...args) {
      originalConsoleError.apply(console, args);
      logs.update(prevLogs => {
        const newLogs = [...prevLogs, { type: 'error', content: args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '), time: new Date() }];
        return newLogs.slice(-maxLogs);
      });
    };
    
    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
    };
  });
  
  function togglePanel() {
    visible = !visible;
  }
  
  function clearLogs() {
    logs.set([]);
  }
</script>

<!-- Debug toggle button -->
<button 
  class="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full z-50 shadow-lg flex items-center justify-center w-10 h-10"
  on:click={togglePanel}
  title="Toggle debug panel"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
</button>

<!-- Debug panel -->
{#if visible}
  <div class="fixed bottom-16 right-4 w-96 h-80 bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden z-50">
    <div class="flex border-b">
      <button 
        class="p-2 flex-1 {activePanelTab === 'logs' ? 'bg-indigo-100 text-indigo-700' : ''}"
        on:click={() => activePanelTab = 'logs'}
      >
        Console Logs
      </button>
      <button 
        class="p-2 flex-1 {activePanelTab === 'state' ? 'bg-indigo-100 text-indigo-700' : ''}"
        on:click={() => activePanelTab = 'state'}
      >
        UI State
      </button>
    </div>
    
    <div class="h-64 overflow-auto p-2">
      {#if activePanelTab === 'logs'}
        <div class="flex justify-end mb-2">
          <button class="text-xs text-gray-500 hover:text-gray-700" on:click={clearLogs}>Clear</button>
        </div>
        
        {#if $logs.length === 0}
          <div class="text-gray-500 text-center h-full flex items-center justify-center">
            No logs yet. Perform some actions to see logs here.
          </div>
        {:else}
          {#each $logs as log}
            <div class="mb-1 text-xs {log.type === 'error' ? 'text-red-600' : 'text-gray-800'}">
              <span class="text-gray-400">{log.time.toLocaleTimeString()}</span>
              <span class="ml-2">{log.content}</span>
            </div>
          {/each}
        {/if}
      {:else if activePanelTab === 'state'}
        <div class="space-y-2">
          <div class="font-semibold text-sm">Loading States:</div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            {#each Object.entries($loadingStates) as [key, value]}
              <div>{key}:</div>
              <div class={value ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                {value ? 'LOADING' : 'idle'}
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if} 