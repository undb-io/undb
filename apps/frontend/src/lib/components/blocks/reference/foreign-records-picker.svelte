<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { Records, TableDo, type IRecordsDTO } from "@undb/table"
  import { createRender, createTable, Render, Subscribe } from "svelte-headless-table"
  import { addSelectedRows } from "svelte-headless-table/plugins"
  import { derived, writable, type Readable } from "svelte/store"
  import GridViewCheckbox from "$lib/components/blocks/grid-view/grid-view-checkbox.svelte"
  import GridViewHeader from "$lib/components/blocks/grid-view/grid-view-header.svelte"
  import GridViewCell from "$lib/components/blocks/grid-view/grid-view-cell.svelte"
  import * as Table from "$lib/components/ui/table"
  import { ScrollArea } from "$lib/components/ui/scroll-area"

  export let foreignTable: Readable<TableDo>

  const getForeignTableRecords = createQuery(
    derived([foreignTable], ([$table]) => ({
      queryKey: ["records", $table.id.value],
      enabled: !!$table,
      queryFn: () =>
        trpc.record.list.query({
          tableId: $table.id.value,
          pagination: { limit: 50, page: 1 },
        }),
    })),
  )

  $: records = (($getForeignTableRecords.data as any)?.records as IRecordsDTO) ?? []
  $: dos = Records.fromJSON($foreignTable, records).map

  // TODO: record type
  let data = writable<any[]>([])
  $: records, data.set(records.map((r) => ({ id: r.id, ...r.values })))

  const table = createTable(data, {
    select: addSelectedRows(),
  })

  $: columns =
    table.createColumns([
      table.column({
        accessor: "select",
        header: (_, { pluginStates }) => {
          const { allPageRowsSelected } = pluginStates.select
          return createRender(GridViewCheckbox, {
            checked: allPageRowsSelected,
          })
        },
        cell: ({ row }, { pluginStates }) => {
          const { getRowState } = pluginStates.select
          const { isSelected } = getRowState(row)

          return createRender(GridViewCheckbox, {
            checked: isSelected,
          })
        },
      }),
      ...($foreignTable.getOrderedVisibleFields() ?? []).map((field, index) =>
        table.column({
          header: () => createRender(GridViewHeader, { field }),
          accessor: field.id.value,
          cell: (item) => {
            const record = dos.get(item.row.original.id)
            const displayValue = record?.displayValues?.toJSON()?.[field.id.value]
            return createRender(GridViewCell, {
              index,
              value: item.value,
              field,
              recordId: item.row.original.id,
              displayValue,
            })
          },
        }),
      ),
    ]) ?? []

  const viewModel = writable(table.createViewModel(columns ?? []))
  $: columns, viewModel.set(table.createViewModel(columns))

  $: headerRows = $viewModel.headerRows
  $: pageRows = $viewModel.pageRows
  $: tableAttrs = $viewModel.tableAttrs
  $: tableBodyAttrs = $viewModel.tableBodyAttrs

  export let selected: string[] = []
  $: selectedDataIds = $viewModel.pluginStates.select.selectedDataIds
  $: selected = Object.entries($selectedDataIds)
    .filter(([, isSelected]) => isSelected)
    .map(([id]) => records[Number(id)].id)
</script>

<ScrollArea orientation="both" class="h-full flex-1 overflow-auto">
  <Table.Root {...$tableAttrs}>
    <Table.Header>
      {#each $headerRows as headerRow}
        <Subscribe rowAttrs={headerRow.attrs()}>
          <Table.Row>
            {#each headerRow.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
                <Table.Head {...attrs}>
                  <Render of={cell.render()} />
                </Table.Head>
              </Subscribe>
            {/each}
          </Table.Row>
        </Subscribe>
      {/each}
    </Table.Header>
    <Table.Body {...$tableBodyAttrs}>
      {#each $pageRows as row (row.id)}
        <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
          <Table.Row {...rowAttrs}>
            {#each row.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs>
                <Table.Cell {...attrs}>
                  <Render of={cell.render()} />
                </Table.Cell>
              </Subscribe>
            {/each}
          </Table.Row>
        </Subscribe>
      {/each}
    </Table.Body>
  </Table.Root>
</ScrollArea>
