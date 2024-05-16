<script lang="ts">
  import { Render, Subscribe, createRender, createTable } from "svelte-headless-table"
  import { writable } from "svelte/store"
  import GridViewCheckbox from "./grid-view-checkbox.svelte"
  import * as Table from "$lib/components/ui/table/index.js"
  import { addResizedColumns, addSelectedRows } from "svelte-headless-table/plugins"
  import { cn } from "$lib/utils.js"
  import { RecordDO, type IColors, type IRecordsDTO } from "@undb/table"
  import { createQuery } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { getTable } from "$lib/store/table.store"
  import GridViewActions from "./grid-view-actions.svelte"
  import GridViewCell from "./grid-view-cell.svelte"
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte"
  import TableTools from "../table-tools/table-tools.svelte"
  import GridViewHeader from "./grid-view-header.svelte"

  const t = getTable()

  $: tableId = $t.id.value
  $: view = $t.views.getViewById()
  $: colorSpec = view.color.into(undefined)?.getSpec($t.schema).into(undefined)

  $: getRecords = createQuery({
    queryKey: ["records", tableId],
    queryFn: () => trpc.record.list.query({ tableId }),
  })

  function getBorder(color: IColors): string {
    const map: Record<IColors, string> = {
      black: "border-black",
      red: "border-red-500",
      green: "border-green-500",
      blue: "border-blue-500",
      yellow: "border-yellow-500",
      purple: "border-purple-500",
      gray: "border-gray-500",
      orange: "border-orange-500",
      pink: "border-pink-500",
      cyan: "border-cyan-500",
      teal: "border-teal-500",
      indigo: "border-indigo-500",
    }
    return map[color]
  }

  $: records = ($getRecords.data as IRecordsDTO | undefined) ?? []
  $: dos = new Map(records.map((r) => [r.id, RecordDO.fromJSON($t, r)]))

  // TODO: record type
  let data = writable<any[]>([])
  $: records, data.set(records.map((r) => ({ id: r.id, ...r.values })))

  const table = createTable(data, {
    select: addSelectedRows(),
    resize: addResizedColumns(),
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
        plugins: {
          resize: {
            initialWidth: 40,
            disable: true,
          },
        },
      }),
      ...($t.schema.fields ?? []).map((field, index) => {
        return table.column({
          header: () => createRender(GridViewHeader, { field }),
          accessor: field.id.value,
          cell: (item) => {
            return createRender(GridViewCell, { index, value: item.value })
          },
        })
      }),
      table.column({
        header: "",
        accessor: ({ id }) => id,
        cell: (item) => {
          return createRender(GridViewActions, { id: item.value })
        },
        plugins: {
          resize: {
            initialWidth: 50,
            disable: true,
          },
        },
      }),
    ]) ?? []

  const viewModel = writable(table.createViewModel(columns ?? []))
  $: columns, viewModel.set(table.createViewModel(columns))

  $: headerRows = $viewModel.headerRows
  $: pageRows = $viewModel.pageRows
  $: tableAttrs = $viewModel.tableAttrs
  $: tableBodyAttrs = $viewModel.tableBodyAttrs
  $: rows = $viewModel.rows

  $: selectedDataIds = $viewModel.pluginStates.select.selectedDataIds
</script>

<div class="w-full">
  <div class="mb-4">
    <TableTools />
  </div>
  <div class="rounded-md border">
    <Table.Root {...$tableAttrs}>
      <Table.Header>
        {#each $headerRows as headerRow}
          <Subscribe rowAttrs={headerRow.attrs()}>
            <Table.Row>
              {#each headerRow.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
                  <Table.Head {...attrs} class={cn("[&:has([role=checkbox])]:pl-3")}>
                    {#if cell.id === "select" && !$data.length}
                      <Checkbox checked={false} disabled />
                    {:else}
                      <Render of={cell.render()} />
                    {/if}
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
            <Table.Row {...rowAttrs} data-state={$selectedDataIds[row.id] && "selected"}>
              {@const record = dos.get(row.original.id)}
              {@const match = colorSpec && record ? record.match(colorSpec) : false}
              {@const condition =
                match && record ? view.color.into(undefined)?.getMatchedFieldConditions($t, record)[0] : undefined}
              {#each row.cells as cell, idx (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs>
                  <Table.Cell
                    class={cn(
                      "p-0 [&:has([role=checkbox])]:pl-3",
                      idx === 0 && match && "border-l-4",
                      idx === 0 && condition && getBorder(condition.option.color),
                    )}
                    {...attrs}
                  >
                    {#if cell.id === "amount"}
                      <div class="text-right font-medium">
                        <Render of={cell.render()} />
                      </div>
                    {:else}
                      <Render of={cell.render()} />
                    {/if}
                  </Table.Cell>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
  <div class="flex items-center justify-end space-x-2 py-4">
    <div class="text-muted-foreground flex-1 text-sm">
      {Object.keys($selectedDataIds).length} of {$rows.length} row(s) selected.
    </div>
  </div>
</div>
