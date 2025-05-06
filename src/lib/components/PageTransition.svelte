<script>
  import { navigating } from '$app/stores';
</script>

{#if $navigating}
  <div class="fixed top-0 left-0 right-0 z-50 h-1 bg-indigo-100">
    <div class="h-full bg-indigo-600 animate-loading-bar"></div>
  </div>
{/if}

<style>
  @keyframes loadingBar {
    0% {
      width: 0;
    }
    20% {
      width: 20%;
    }
    40% {
      width: 40%;
    }
    60% {
      width: 60%;
    }
    80% {
      width: 80%;
    }
    100% {
      width: 100%;
    }
  }
  
  .animate-loading-bar {
    animation: loadingBar 1s ease-in-out infinite;
  }
</style> 