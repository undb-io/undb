<script lang="ts">
  import { TableFactory, type IWidgetDTO } from "@undb/table"
  import { GetDashboardWidgetShareTableStore, GetDashboardWidgetTableStore } from "$houdini"
  import Widget from "../widget/widget.svelte"
  import { setTable } from "$lib/store/table.store"
  import { writable } from "svelte/store"

  export let tableId: string | undefined
  export let shareId: string | undefined = undefined
  export let widget: IWidgetDTO
  export let movePointerDown: ((e: Event) => void) | undefined = undefined
  export let resizePointerDown: ((e: Event) => void) | undefined = undefined

  const store = new GetDashboardWidgetTableStore()
  const shareStore = new GetDashboardWidgetShareTableStore()

  $: if (tableId) {
    if (shareId) {
      shareStore.fetch({ variables: { shareId, tableId } })
    } else {
      store.fetch({ variables: { tableId } })
    }
  }

  $: table = shareId ? $shareStore.data?.tableByShareDashboard : $store.data?.table
  $: tableDo = table ? new TableFactory().fromJSON(table) : undefined

  $: if (tableDo) {
    setTable(writable(tableDo))
  }
</script>

<Widget table={tableDo} {widget} {tableId} {shareId} {movePointerDown} {resizePointerDown} />
