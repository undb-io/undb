<script lang="ts">
  import DashboardWidgets from "$lib/components/blocks/dashboard/dashboard-widgets.svelte"
  import AddDashboardWidgetButton from "$lib/components/blocks/widget/add-dashboard-widget-button.svelte"
  import { getDashboard } from "$lib/store/dashboard.store"
  import { derived } from "svelte/store"
  import { GaugeIcon } from "lucide-svelte"
  import ShareButton from "$lib/components/blocks/share/share-button.svelte"
  import { invalidate } from "$app/navigation"

  const dashboard = getDashboard()

  const widgets = derived(dashboard, ($dashboard) => $dashboard?.widgets)
</script>

<div class="flex h-full flex-col">
  <header class="flex items-center justify-between border-b px-4 py-2">
    <h1 class="flex items-center text-lg font-medium">
      <GaugeIcon class="mr-2 size-5" />
      {$dashboard.name.value}
    </h1>
    <div class="flex items-center gap-2">
      <ShareButton
        type="dashboard"
        id={$dashboard.id.value}
        onSuccess={() => {
          invalidate(`undb:dashboard:${$dashboard.id.value}`)
        }}
      />

      <AddDashboardWidgetButton variant="outline" size="sm" />
    </div>
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
