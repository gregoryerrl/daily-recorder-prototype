<script>
  import { toast } from '$lib/stores/ui.js';
  import Toast from './Toast.svelte';
</script>

{#if $toast.show}
  <Toast 
    message={$toast.message} 
    type={$toast.type} 
    duration={$toast.duration}
    show={$toast.show}
  />
{/if} 