<script lang="ts">
  import { TableFactory, type IWidgetDTO } from "@undb/table"
  import { GetDashboardWidgetShareTableStore } from "$houdini"
  import Widget from "../widget/widget.svelte"
  import { setTable } from "$lib/store/table.store"
  import { writable } from "svelte/store"
  import { getDataService } from "$lib/store/data-service.store"
  import { createQuery } from "@tanstack/svelte-query"

  export let tableId: string | undefined
  export let shareId: string | undefined = undefined
  export let readonly = false
  export let widget: IWidgetDTO
  export let movePointerDown: ((e: Event) => void) | undefined = undefined
  export let resizePointerDown: ((e: Event) => void) | undefined = undefined

  const dataService = getDataService()

  const shareStore = new GetDashboardWidgetShareTableStore()

  $: if (tableId) {
    if (shareId) {
      shareStore.fetch({ variables: { shareId, tableId } })
    }
  }

  const getTable = createQuery({
    queryFn: () => dataService.table.getTable({ tableId: tableId! }),
    queryKey: ["dashboard-widget-table", tableId],
    enabled: !!tableId && !shareId,
  })

  $: table = shareId ? $shareStore.data?.tableByShareDashboard : $getTable.data
  $: tableDo = table ? new TableFactory().fromJSON(table) : undefined

  $: if (tableDo) {
    setTable(writable(tableDo))
  }
</script>

<Widget table={tableDo} {widget} {tableId} {shareId} {movePointerDown} {resizePointerDown} {readonly} />
