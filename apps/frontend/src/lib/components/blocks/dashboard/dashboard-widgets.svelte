<script lang="ts">
  import { getDashboard } from "$lib/store/dashboard.store"
  import DashboardWidget from "./dashboard-widget.svelte"

  const dashboard = getDashboard()
</script>

<div class="grid h-full w-full grid-cols-6 gap-2">
  {#each $dashboard?.widgets.value as widget}
    {@const tableId = widget.table.id}
    {#if tableId}
      <DashboardWidget widget={widget.widget} {tableId} />
    {/if}
  {/each}
</div>
