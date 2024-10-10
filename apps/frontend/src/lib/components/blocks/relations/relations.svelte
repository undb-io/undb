<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { Svelvet } from "svelvet"
  import TableNode from "./table-node.svelte"
  import { GetTableForeignTablesStore } from "$houdini"
  import { TableFactory } from "@undb/table"

  const table = getTable()

  const getForeignTablesStore = new GetTableForeignTablesStore()

  $: getForeignTablesStore.fetch({ variables: { tableId: $table.id.value } })

  $: foreignTablesDTO = $getForeignTablesStore.data?.tableForeignTables ?? []
  // @ts-ignore
  $: foreignTables = foreignTablesDTO.map((table) => new TableFactory().fromJSON(table))
</script>

<Svelvet controls minimap>
  <TableNode table={$table} position={{ x: 100, y: 50 }} />

  {#each foreignTables as table, index}
    {@const position = { x: ((index + 1) % 5) * 400, y: ((index + 1) / 5) * 400 }}
    <TableNode {table} {position} />
  {/each}
</Svelvet>
