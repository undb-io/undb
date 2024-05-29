<script lang="ts">
  import * as ContextMenu from "$lib/components/ui/context-menu"
  import { Render, Subscribe, createRender, createTable } from "svelte-headless-table"
  import { derived, writable } from "svelte/store"
  import GridViewCheckbox from "./grid-view-checkbox.svelte"
  import * as Table from "$lib/components/ui/table/index.js"
  import { addResizedColumns, addSelectedRows } from "svelte-headless-table/plugins"
  import { copyToClipboard } from "@svelte-put/copy"
  import { toast } from "svelte-sonner"
  import { cn } from "$lib/utils.js"
  import { RecordEventFactory, Records, type IRecordsDTO } from "@undb/table"
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
  import { getColor } from "./grid-view.util"
  import GridViewOpen from "./grid-view-open.svelte"
  import { queryParam } from "sveltekit-search-params"
  import { isFunction } from "radash"
  import GridViewFooter from "./grid-view-footer.svelte"
  import { page } from "$app/stores"
  import { DELETE_RECORD_MODAL, DUPLICATE_RECORD_MODAL, toggleModal } from "$lib/store/modal.store"
  import type { LayoutData } from "../../../../routes/(authed)/t/[tableId]/$types"
  import { ScrollArea } from "$lib/components/ui/scroll-area"
  import { onDestroy, onMount } from "svelte"

  const t = getTable()

  const q = queryParam("q")
  const r = queryParam("r")
  const deleteRecordId = queryParam("deleteRecordId")
  const duplicateRecordId = queryParam("duplicateRecordId")

  const copy = async (id: string) => {
    await copyToClipboard(id)
    toast.success("Copied record ID to clipboard")
  }

  $: pageData = $page.data as LayoutData
  $: tableStore = pageData.tableStore
  $: aggregate = $tableStore.data?.table?.viewData?.aggregate

  $: view = $t.views.getViewById()
  $: viewFilter = view.filter.into(undefined)
  $: hasFilterFieldIds = viewFilter?.fieldIds
  const perPage = writable(50)
  const currentPage = writable(1)

  const getRecords = createQuery(
    derived([t, perPage, currentPage, q], ([$table, $perPage, $currentPage, $q]) => {
      return {
        queryKey: ["records", $table?.id.value, $table.views.getViewById()?.id.value, $q, $currentPage, $perPage],
        queryFn: () =>
          trpc.record.list.query({
            tableId: $table?.id.value,
            q: $q ?? undefined,
            pagination: { limit: $perPage, page: $currentPage },
          }),
      }
    }),
  )

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
      table.column({
        accessor: "open",
        header: () => "",
        cell: ({ row }) => createRender(GridViewOpen, { recordId: row.original.id }),
        plugins: {
          resize: {
            initialWidth: 30,
            disable: true,
          },
        },
      }),
      ...($t.getOrderedFields() ?? []).map((field, index) =>
        table.column({
          header: () => createRender(GridViewHeader, { field }),
          accessor: field.id.value,
          cell: (item) =>
            createRender(GridViewCell, { index, value: item.value, field, recordId: item.row.original.id }),
          footer: createRender(GridViewFooter, { field, aggregateResult: aggregate?.[field.id.value] }),
          plugins: {
            resize: {
              initialWidth: 200,
            },
          },
        }),
      ),
      table.column({
        header: "",
        accessor: ({ id }) => id,
        cell: (item) => createRender(GridViewActions, { id: item.value }),
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

  $: visibleColumns = $viewModel.visibleColumns
  $: headerRows = $viewModel.headerRows
  $: pageRows = $viewModel.pageRows
  $: tableAttrs = $viewModel.tableAttrs
  $: tableHeaderAttrs = $viewModel.tableHeadAttrs
  $: tableBodyAttrs = $viewModel.tableBodyAttrs
  $: rows = $viewModel.rows

  $: selectedDataIds = $viewModel.pluginStates.select.selectedDataIds

  $: resize = $viewModel.pluginStates.resize.columnWidths

  let evtSource: EventSource

  onMount(() => {
    evtSource = new EventSource(`/api/tables/${$t.id.value}/subscription`, { withCredentials: true })
    evtSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      const recordEvent = RecordEventFactory.fromJSON(data)
      if (recordEvent.isNone()) return

      // TODO: use event
      const evt = recordEvent.unwrap()
    }
  })

  onDestroy(() => {
    evtSource.close()
  })
</script>

<div class="flex h-full w-full flex-col">
  <TableTools />
  <ScrollArea orientation="both" class="flex-1 overflow-auto rounded-md border">
    <table {...$tableAttrs} class="flex h-full flex-col">
      <Table.Header {...$tableHeaderAttrs} class="sticky top-0 z-50 bg-white">
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
      <Table.Body {...$tableBodyAttrs} class="flex-1">
        {#each $pageRows as row (row.id)}
          {@const recordId = row.original.id}
          <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
            <ContextMenu.Root>
              <ContextMenu.Trigger>
                <Table.Row
                  {...rowAttrs}
                  data-state={$selectedDataIds[row.id] && "selected"}
                  class="text-foreground group text-xs transition-none"
                >
                  {@const record = dos.get(recordId)}
                  {@const match = colorSpec && record ? record.match(colorSpec) : false}
                  {@const condition =
                    match && record ? view.color.into(undefined)?.getMatchedFieldConditions($t, record)[0] : undefined}
                  {#each row.cells as cell, idx (cell.id)}
                    {@const hasFilter = hasFilterFieldIds?.has(cell.id) ?? false}
                    <Subscribe attrs={cell.attrs()} let:attrs>
                      <Table.Cell
                        class={cn(
                          "border-border relative border-r p-0 [&:has([role=checkbox])]:pl-3",
                          (idx === 0 || idx === 1) && "border-r-0",
                          hasFilter && "bg-orange-50",
                        )}
                        {...attrs}
                      >
                        {#if idx === 0 && match && condition && "border-l-4"}
                          <div
                            class={cn("absolute bottom-0 left-0 top-0 h-full w-1", getColor(condition.option.color))}
                          ></div>
                          <!-- content here -->
                        {/if}
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
              </ContextMenu.Trigger>
              <ContextMenu.Content>
                <ContextMenu.Item on:click={() => ($r = recordId)}>View record details</ContextMenu.Item>
                <ContextMenu.Item on:click={() => copy(recordId)}>Copy record ID</ContextMenu.Item>
                <ContextMenu.Item
                  on:click={() => {
                    toggleModal(DUPLICATE_RECORD_MODAL)
                    $duplicateRecordId = recordId
                  }}
                >
                  Duplicate Record
                </ContextMenu.Item>
                <ContextMenu.Item
                  on:click={() => {
                    toggleModal(DELETE_RECORD_MODAL)
                    $deleteRecordId = recordId
                  }}
                  class="text-red-500 data-[highlighted]:bg-red-100 data-[highlighted]:text-red-500"
                >
                  Delete Record
                </ContextMenu.Item>
              </ContextMenu.Content>
            </ContextMenu.Root>
          </Subscribe>
        {/each}
      </Table.Body>

      <tfooter class="text-muted-foreground sticky bottom-0 h-8 w-full border-t bg-white text-sm">
        <tr class="flex h-8 w-full">
          {#each $visibleColumns as column}
            {@const width = $resize[column.id]}
            <td
              style={`width: ${width}px; min-width: ${width}px; max-width: ${width}px`}
              class="h-full overflow-hidden"
            >
              {#if column.footer && !isFunction(column.footer)}
                <Render of={column.footer} />
              {/if}
            </td>
          {/each}
        </tr>
      </tfooter>
    </table>
  </ScrollArea>

  <div class="flex items-center justify-between space-x-2 px-4 py-2">
    <div class="text-muted-foreground flex-1 text-sm">
      {Object.keys($selectedDataIds).length} of {$rows.length} row(s) selected.
    </div>

    <div class="flex flex-1 flex-row items-center">
      <GridViewPagination perPage={$perPage} bind:currentPage={$currentPage} count={$getRecords.data?.total} />
      <div class="flex items-center gap-2 text-sm">
        <Select.Root
          selected={{ value: $perPage, label: String($perPage) }}
          onSelectedChange={(value) => {
            if (value) {
              $perPage = value.value
            }
            $currentPage = 1
          }}
        >
          <Select.Trigger value={$perPage} class="min-w-16">
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
