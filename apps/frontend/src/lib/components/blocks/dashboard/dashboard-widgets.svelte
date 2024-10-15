<script lang="ts">
  import { getDashboard } from "$lib/store/dashboard.store"
  import { COLS, cols, widgetItems } from "$lib/store/widget.store"
  import DashboardWidget from "./dashboard-widget.svelte"

  // @ts-ignore
  import Grid from "svelte-grid"

  const dashboard = getDashboard()

  $: if ($dashboard) {
    widgetItems.init($dashboard)
  }

  const onPointeup = () => {
    const widgets = $widgetItems.map((item) => {
      const { x, y, h, w } = item[COLS]
      const layout = { x, y, h, w }
      return { id: item.id, layout }
    })

    // $relayoutWidgets.mutate({
    // 	tableId: $table.id.value,
    // 	viewId: $view.id.value,
    // 	widgets,
    // })
  }
</script>

<div class="h-full w-full">
  <Grid
    bind:items={$widgetItems}
    rowHeight={100}
    let:dataItem
    {cols}
    fastStart
    fillSpace
    let:movePointerDown
    let:resizePointerDown
    on:pointerup={onPointeup}
  >
    {#if dataItem.widget}
      <DashboardWidget widget={dataItem.widget} tableId={dataItem.tableId} {movePointerDown} {resizePointerDown} />
    {/if}
  </Grid>
</div>
