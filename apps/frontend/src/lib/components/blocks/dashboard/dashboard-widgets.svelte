<script lang="ts">
  import { getDashboard, getDashboardWidgetItemsStore } from "$lib/store/dashboard.store"
  import { cols } from "$lib/store/widget.store"
  import { createMutation } from "@tanstack/svelte-query"
  import DashboardWidget from "./dashboard-widget.svelte"

  // @ts-ignore
  import Grid from "svelte-grid"
  import { trpc } from "$lib/trpc/client"
  import { COLS, type IDashboardLayouts } from "@undb/dashboard"

  export let shareId: string | undefined = undefined
  export let readonly = false

  const dashboard = getDashboard()

  const widgetItems = getDashboardWidgetItemsStore()

  const relayoutWidgetsMutation = createMutation({
    mutationFn: trpc.dashboard.widget.relayout.mutate,
  })

  const onPointeup = () => {
    if (readonly) return
    const widgets = $widgetItems
      .map((item) => {
        const { x, y, h, w } = item[COLS]
        const layout = { x, y, h, w }
        return { id: item.id, layout }
      })
      .reduce((acc, cur) => {
        acc![cur.id] = cur.layout
        return acc
      }, {} as IDashboardLayouts)

    $relayoutWidgetsMutation.mutate({
      dashboardId: $dashboard.id.value,
      layout: widgets,
    })
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
      <DashboardWidget
        widget={dataItem.widget}
        {shareId}
        {readonly}
        tableId={dataItem.tableId}
        {movePointerDown}
        {resizePointerDown}
      />
    {/if}
  </Grid>
</div>

<style>
  :global(.svlt-grid-shadow) {
    /* Back shadow */
    background: #dbeafe !important;
    opacity: 0.5;
    border: 2px #2563eb dashed;
    border-radius: 4px;
  }

  :global(.svlt-grid-item) {
    opacity: 1 !important;
  }
</style>
