<script lang="ts">
  import { TableFactory, type IWidgetDTO } from "@undb/table"
  import { GetDashboardWidgetTableStore } from "$houdini"
  import { onMount } from "svelte"
  import Widget from "../widget/widget.svelte"
  import { setTable } from "$lib/store/table.store"
  import { writable } from "svelte/store"

  export let tableId: string
  export let widget: IWidgetDTO

  const store = new GetDashboardWidgetTableStore()
  onMount(() => {
    store.fetch({ variables: { tableId } })
  })

  $: table = $store.data?.table

  $: if (table) {
    const t = new TableFactory().fromJSON(table)
    setTable(writable(t))
  }
</script>

{#if table}
  <Widget {widget} {tableId} />
{/if}
