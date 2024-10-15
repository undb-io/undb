<script lang="ts">
  import { getDashboard } from "$lib/store/dashboard.store"
  import { cols, widgetItems } from "$lib/store/widget.store"
  import DashboardWidget from "./dashboard-widget.svelte"

  // @ts-ignore
  import Grid from "svelte-grid"

  const dashboard = getDashboard()

  $: if ($dashboard) {
    widgetItems.init($dashboard)
  }
</script>

<div class="h-full w-full">
  <Grid bind:items={$widgetItems} rowHeight={100} let:dataItem {cols} fastStart fillSpace>
    <DashboardWidget widget={dataItem.widget} tableId={dataItem.tableId} />
  </Grid>
  <!-- {#each $dashboard?.widgets.value as widget}
    {@const tableId = widget.table.id}
    {#if tableId}
      <DashboardWidget widget={widget.widget} {tableId} />
    {/if}
  {/each} -->
</div>
