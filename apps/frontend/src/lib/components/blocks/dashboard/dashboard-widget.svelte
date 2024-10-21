<script lang="ts">
  import { TableFactory, type IWidgetDTO } from "@undb/table"
  import { GetDashboardWidgetTableStore } from "$houdini"
  import { onMount } from "svelte"
  import Widget from "../widget/widget.svelte"
  import { setTable } from "$lib/store/table.store"
  import { writable } from "svelte/store"

  export let tableId: string | undefined
  export let widget: IWidgetDTO
  export let movePointerDown: ((e: Event) => void) | undefined = undefined
  export let resizePointerDown: ((e: Event) => void) | undefined = undefined

  const store = new GetDashboardWidgetTableStore()

  $: if (tableId) {
    store.fetch({ variables: { tableId } })
  }

  $: table = $store.data?.table
  $: tableDo = table ? new TableFactory().fromJSON(table) : undefined

  $: if (tableDo) {
    setTable(writable(tableDo))
  }
</script>

<Widget table={tableDo} {widget} {tableId} {movePointerDown} {resizePointerDown} />
