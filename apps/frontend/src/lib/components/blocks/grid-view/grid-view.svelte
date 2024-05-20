<script lang="ts">
  import { Render, Subscribe, createRender, createTable } from "svelte-headless-table"
  import { writable } from "svelte/store"
  import GridViewCheckbox from "./grid-view-checkbox.svelte"
  import * as Table from "$lib/components/ui/table/index.js"
  import { addResizedColumns, addSelectedRows } from "svelte-headless-table/plugins"
  import { cn } from "$lib/utils.js"
  import { Records, type IRecordsDTO } from "@undb/table"
  import { createQuery } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { getTable } from "$lib/store/table.store"
  import GridViewActions from "./grid-view-actions.svelte"
  import GridViewCell from "./grid-view-cell.svelte"
  import GridViewPagination from "./grid-view-pagination.svelte"
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte"
  import TableTools from "../table-tools/table-tools.svelte"
  import GridViewHeader from "./grid-view-header.svelte"
  import * as Select from "$lib/components/ui/select"
  import { getBorder } from "./grid-view.util"

  const t = getTable()

  $: tableId = $t.id.value
  $: view = $t.views.getViewById()
  $: viewFilter = view.filter.into(undefined)
  $: hasFilterFieldIds = viewFilter?.fieldIds
  let perPage = 50
  let currentPage = 1

  $: getRecords = createQuery({
    queryKey: [tableId, view.id.value, "records"],
    queryFn: () =>
      trpc.record.list.query({
        tableId,
        pagination: { limit: perPage, page: currentPage },
      }),
  })

  $: colorSpec = view.color.into(undefined)?.getSpec($t.schema).into(undefined)

  // TODO: record type
  $: records = (($getRecords.data as any)?.records as IRecordsDTO) ?? []
  $: dos = Records.fromJSON($t, records).map
  $: total = ($getRecords.data as any)?.total ?? 0

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
      ...($t.getOrderedFields() ?? []).map((field, index) => {
        return table.column({
          header: () => createRender(GridViewHeader, { field }),
          accessor: field.id.value,
          cell: (item) => {
            return createRender(GridViewCell, { index, value: item.value, field, recordId: item.row.original.id })
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
  <TableTools />
  <div class="rounded-md border">
    <Table.Root {...$tableAttrs}>
      <Table.Header>
        {#each $headerRows as headerRow}
          <Subscribe rowAttrs={headerRow.attrs()}>
            <Table.Row class="text-xs transition-none hover:bg-inherit">
              {#each headerRow.cells as cell, i (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
                  {@const hasFilter = hasFilterFieldIds?.has(cell.id) ?? false}
                  <Table.Head
                    {...attrs}
                    class={cn(
                      "h-9 border-r [&:has([role=checkbox])]:pl-3",
                      i === 0 && "border-r-0",
                      hasFilter && "bg-orange-50",
                    )}
                  >
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
            <Table.Row
              {...rowAttrs}
              data-state={$selectedDataIds[row.id] && "selected"}
              class="text-foreground text-xs transition-none"
            >
              {@const record = dos.get(row.original.id)}
              {@const match = colorSpec && record ? record.match(colorSpec) : false}
              {@const condition =
                match && record ? view.color.into(undefined)?.getMatchedFieldConditions($t, record)[0] : undefined}
              {#each row.cells as cell, idx (cell.id)}
                {@const hasFilter = hasFilterFieldIds?.has(cell.id) ?? false}
                <Subscribe attrs={cell.attrs()} let:attrs>
                  <Table.Cell
                    class={cn(
                      "border-border border-r p-0 [&:has([role=checkbox])]:pl-3",
                      idx == 0 && "border-r-0",
                      idx === 0 && match && "border-l-4",
                      idx === 0 && condition && getBorder(condition.option.color),
                      hasFilter && "bg-orange-50",
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
  <div class="flex items-center justify-between space-x-2 px-4 py-2">
    <div class="text-muted-foreground flex-1 text-sm">
      {Object.keys($selectedDataIds).length} of {$rows.length} row(s) selected.
    </div>

    <div class="flex flex-1 flex-row items-center">
      <GridViewPagination {perPage} bind:currentPage />
      <div class="flex items-center gap-2 text-sm">
        <Select.Root
          selected={{ value: perPage, label: String(perPage) }}
          onSelectedChange={(value) => {
            if (value) {
              perPage = value.value
            }
            currentPage = 1
          }}
        >
          <Select.Trigger value={perPage} class="min-w-16">
            <Select.Value placeholder="page" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value={1}>1</Select.Item>
            <Select.Item value={10}>10</Select.Item>
            <Select.Item value={50}>50</Select.Item>
            <Select.Item value={100}>100</Select.Item>
          </Select.Content>
        </Select.Root>

        <span class="text-muted-foreground inline-flex flex-1 flex-nowrap text-xs">
          {total} rows
        </span>
      </div>
    </div>
  </div>
</div>
