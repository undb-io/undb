<script>
  import "../app.pcss"

  import { browser } from "$app/environment"
  import { Toaster } from "$lib/components/ui/sonner"
  import { ModeWatcher } from "mode-watcher"

  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query"
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
      },
    },
  })
</script>

<ModeWatcher defaultMode="light" />
<Toaster />
<div class="app">
  <main>
    <QueryClientProvider client={queryClient}>
      <slot></slot>
    </QueryClientProvider>
  </main>
</div>
