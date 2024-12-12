<script lang="ts">
  import "../app.pcss"

  import { browser } from "$app/environment"
  import { Toaster } from "$lib/components/ui/sonner"
  import { ModeWatcher } from "mode-watcher"

  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query"
  import ImagePreview from "$lib/components/blocks/attachment/image-preview.svelte"
  import {
    setLocale,
    loadLocaleAsync,
    detectLocale,
    localStorageDetector,
    queryStringDetector,
    documentCookieDetector,
  } from "@undb/i18n/client"
  import { onMount } from "svelte"
  import { setDataService } from "$lib/store/data-service.store"
  import type { LayoutData } from "./$types"

  export let data: LayoutData

  setDataService(data.dataService)

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
      },
    },
  })

  onMount(async () => {
    const lang = detectLocale(documentCookieDetector, queryStringDetector, localStorageDetector)
    await loadLocaleAsync(lang)
    setLocale(lang)
  })
</script>

<ModeWatcher defaultMode="light" />
<Toaster richColors position="bottom-center" />
<div class="app h-full">
  <main class="h-full">
    <QueryClientProvider client={queryClient}>
      <slot></slot>
    </QueryClientProvider>
  </main>
</div>

<ImagePreview />

<svelte:head>
  <link rel="icon" href="/assets/favicon/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon/favicon-16x16.png" />
  <link rel="manifest" href="/assets/favicon/site.webmanifest" />
  <title>undb</title>
</svelte:head>
