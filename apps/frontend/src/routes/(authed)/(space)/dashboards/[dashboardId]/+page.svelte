<script lang="ts">
  import DashboardWidgets from "$lib/components/blocks/dashboard/dashboard-widgets.svelte"
  import AddDashboardWidgetButton from "$lib/components/blocks/widget/add-dashboard-widget-button.svelte"
  import { getDashboard } from "$lib/store/dashboard.store"
  import { derived } from "svelte/store"

  const dashboard = getDashboard()

  const widgets = derived(dashboard, ($dashboard) => $dashboard?.widgets)
</script>

<div class="flex h-full flex-col">
  <header class="flex items-center justify-end border-b px-4 py-2">
    <AddDashboardWidgetButton variant="outline" size="sm" />
  </header>
  {#if $widgets?.value.length}
    <main class="px-4 py-4">
      <DashboardWidgets />
    </main>
  {:else}
    <div class="flex flex-1 items-center justify-center">
      <AddDashboardWidgetButton />
    </div>
  {/if}
</div>
