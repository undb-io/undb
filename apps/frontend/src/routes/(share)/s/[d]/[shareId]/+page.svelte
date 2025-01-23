<script lang="ts">
  import { page } from "$app/stores"
  import DashboardWidgets from "$lib/components/blocks/dashboard/dashboard-widgets.svelte"
  import { getDashboard } from "$lib/store/dashboard.store"
  import { GaugeIcon } from "lucide-svelte"
  import { setShareId } from "$lib/store/share.store.svelte"

  const dashboard = getDashboard()

  const shareId = $page.params.shareId

  $: if (shareId) {
    setShareId(shareId)
  }
</script>

<div class="flex h-full flex-col">
  <header class="flex items-center justify-between border-b px-4 py-2">
    <h1 class="flex items-center text-lg font-medium">
      <GaugeIcon class="mr-2 size-5" />
      {$dashboard.name.value}
    </h1>
  </header>
  <main class="px-4 py-4">
    <DashboardWidgets {shareId} />
  </main>
</div>
