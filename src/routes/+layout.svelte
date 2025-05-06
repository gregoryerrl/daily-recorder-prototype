<script>
  import '../app.css';
  import PageTransition from '$lib/components/PageTransition.svelte';
  import ToastManager from '$lib/components/ToastManager.svelte';
  import DebugPanel from '$lib/components/DebugPanel.svelte';
</script>

<PageTransition />
<ToastManager />
<DebugPanel />

<div class="min-h-screen bg-gray-100">
  <nav class="bg-indigo-600 text-white shadow-md">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <a href="/" class="text-xl font-bold">Daily Recorder</a>
        <div class="space-x-4">
          <a href="/" class="hover:underline">Home</a>
          <a href="/categories" class="hover:underline">Categories</a>
          <a href="/new" class="hover:underline">New Entry</a>
        </div>
      </div>
    </div>
  </nav>

  <main>
    <slot />
  </main>

  <footer class="bg-white py-4 mt-8 border-t">
    <div class="container mx-auto px-4 text-center text-gray-500 text-sm">
      &copy; {new Date().getFullYear()} Daily Recorder - An SSR Demo Project
    </div>
  </footer>
</div>
