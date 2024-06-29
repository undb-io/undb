<script lang="ts">
  import "../app.pcss"

  import { browser } from "$app/environment"
  import { Toaster } from "$lib/components/ui/sonner"
  import { ModeWatcher } from "mode-watcher"

  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query"
  import ImagePreview from "$lib/components/blocks/attachment/image-preview.svelte"
  import { setLocale, loadLocaleAsync } from "@undb/i18n/client"
  import { onMount } from "svelte"
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
      },
    },
  })

  onMount(async () => {
    await loadLocaleAsync("en")
    setLocale("en")
  })
</script>

<ModeWatcher defaultMode="light" />
<Toaster richColors position="bottom-center" />
<div class="app">
  <main>
    <QueryClientProvider client={queryClient}>
      <slot></slot>
    </QueryClientProvider>
  </main>
</div>

<ImagePreview />
