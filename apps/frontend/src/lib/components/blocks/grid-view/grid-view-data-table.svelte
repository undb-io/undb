<script lang="ts">
  import * as ContextMenu from "$lib/components/ui/context-menu"
  import { Render, Subscribe, createRender, createTable } from "svelte-headless-table"
  import { derived, writable, type Readable, type Writable } from "svelte/store"
  import GridViewCheckbox from "./grid-view-checkbox.svelte"
  import * as Table from "$lib/components/ui/table/index.js"
  import { addResizedColumns, addSelectedRows } from "svelte-headless-table/plugins"
  import { copyToClipboard } from "@svelte-put/copy"
  import { toast } from "svelte-sonner"
  import { cn } from "$lib/utils.js"
  import { getRecordsStore } from "$lib/store/records.store"
  import { GridView, type Field } from "@undb/table"
  import { getTable } from "$lib/store/table.store"
  import GridViewActions from "./grid-view-actions.svelte"
  import GridViewActionHeader from "./grid-view-action-header.svelte"
  import GridViewCell from "./grid-view-cell.svelte"
  import GridViewEmpty from "./grid-view-empty.svelte"
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte"
  import TableTools from "../table-tools/table-tools.svelte"
  import GridViewHeader from "./grid-view-header.svelte"
  import * as Select from "$lib/components/ui/select"
  import { getBgColor } from "./grid-view.util"
  import GridViewOpen from "./grid-view-open.svelte"
  import { queryParam } from "sveltekit-search-params"
  import { isFunction } from "radash"
  import GridViewFooter from "./grid-view-footer.svelte"
  import { DELETE_RECORD_MODAL, DUPLICATE_RECORD_MODAL, toggleModal } from "$lib/store/modal.store"
  import { ScrollArea } from "$lib/components/ui/scroll-area"
  import { ClipboardCopyIcon, CopyIcon, Maximize2Icon, Trash2Icon } from "lucide-svelte"
  import { gridViewStore, isRowSelected, isSelectedCell } from "./grid-view.store"
  import SelectedRecordsButton from "./selected-records-button.svelte"
  import ViewPagination from "../view/view-pagination.svelte"
  import { createMutation } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { preferences } from "$lib/store/persisted.store"
  import ShareTableTools from "$lib/components/blocks/table-tools/share-table-tools.svelte"
  import { LL } from "@undb/i18n/client"

  export let readonly = false
  export let viewId: Readable<string | undefined>
  export let currentPage: Writable<number | null>
  export let isLoading = false
  export let total: number
  export let hidePagination = false
  export let r: Writable<string | null>
  export let shareId: string | undefined

  const t = getTable()

  let fields = derived([t, viewId], ([$t, $viewId]) => $t?.getOrderedVisibleFields($viewId) ?? ([] as Field[]))

  $: perPage = $preferences.gridViewPerPage ?? 50

  const deleteRecordId = queryParam("deleteRecordId")
  const duplicateRecordId = queryParam("duplicateRecordId")

  const copy = async (id: string) => {
    await copyToClipboard(id)
    toast.success($LL.table.record.copiedRecordId())
  }

  let view = derived(t, ($t) => $t.views.getViewById($viewId) as GridView)
  $: viewFilter = $view.filter?.into(undefined)
  $: hasFilterFieldIds = viewFilter?.fieldIds

  $: colorSpec = $view.color?.into(undefined)?.getSpec($t.schema).into(undefined)

  let store = getRecordsStore()
  let hasRecord = store.hasRecord
  let count = store.count

  const setFieldWidth = createMutation({
    mutationFn: trpc.table.view.setFieldWidth.mutate,
  })

  const table = createTable(store.data, {
    select: addSelectedRows(),
    resize: addResizedColumns(),
  })

  let columns = derived([fields, view], ([$fields, $view]) => {
    return table.createColumns([
      table.column({
        accessor: "$select",
        header: (_, { pluginStates }) => {
          const { allPageRowsSelected } = pluginStates.select
          return createRender(GridViewCheckbox, {
            checked: allPageRowsSelected,
            disabled: readonly,
          })
        },
        cell: ({ row }, { pluginStates }) => {
          const { getRowState } = pluginStates.select
          const { isSelected } = getRowState(row)

          return createRender(GridViewCheckbox, {
            checked: isSelected,
            disabled: readonly,
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
        cell: ({ row }) => createRender(GridViewOpen, { recordId: row.original.id, r }),
        plugins: {
          resize: {
            initialWidth: 30,
            disable: true,
          },
        },
      }),
      ...$fields.map((field, index) =>
        table.column({
          header: () => createRender(GridViewHeader, { field }),
          accessor: field.id.value,
          cell: (item) => {
            const record = $store.records.get(item.row.original.id)
            const displayValue = record?.displayValues?.toJSON()?.[field.id.value]
            return createRender(GridViewCell, {
              viewId,
              index,
              value: item.value,
              field,
              recordId: item.row.original.id,
              displayValue,
              readonly,
              record,
            })
          },
          footer: createRender(GridViewFooter, {
            field,
            readonly,
            viewId,
          }),
          plugins: {
            resize: {
              initialWidth: $view.type === "grid" ? $view.getFieldWidth(field.id.value) : 200,
              disable: readonly,
            },
          },
        }),
      ),
      table.column({
        header: () => {
          return createRender(GridViewActionHeader, { readonly })
        },
        accessor: ({ id }) => id,
        cell: (item) => createRender(GridViewActions, { id: item.value, readonly, r }),
        plugins: {
          resize: {
            initialWidth: 50,
            disable: true,
          },
        },
      }),
    ])
  })

  const viewModel = derived(columns, ($columns) => table.createViewModel($columns))

  $: visibleColumns = $viewModel.visibleColumns
  $: headerRows = $viewModel.headerRows
  $: pageRows = $viewModel.pageRows
  $: tableAttrs = $viewModel.tableAttrs
  $: tableHeaderAttrs = $viewModel.tableHeadAttrs
  $: tableBodyAttrs = $viewModel.tableBodyAttrs

  $: selectedDataIds = $viewModel.pluginStates.select.selectedDataIds
  $: selectedRecordIds = Object.keys($selectedDataIds)
    .map(Number)
    .map((index) => $store.ids[index])

  $: columnWidths = $viewModel.pluginStates.resize.columnWidths
</script>

<div class="flex h-full w-full flex-col">
  {#if !readonly}
    <TableTools {r} {viewId} {shareId}>
      {#if selectedRecordIds.length}
        <SelectedRecordsButton
          {viewId}
          onDuplicateSuccess={() => selectedDataIds?.clear()}
          onDeleteSuccess={() => selectedDataIds?.clear()}
          class={selectedRecordIds.length && "opacity-100"}
          ids={selectedRecordIds}
        />
      {/if}
    </TableTools>
  {:else}
    <ShareTableTools {viewId} />
  {/if}
  <ScrollArea orientation="both" class="h-full flex-1 overflow-auto">
    <table {...$tableAttrs} class={cn("flex h-full flex-col", $$restProps.class)}>
      <Table.Header {...$tableHeaderAttrs} class="sticky top-0 z-10 bg-white">
        {#each $headerRows as headerRow}
          <Subscribe rowAttrs={headerRow.attrs()}>
            <Table.Row class="text-xs transition-none hover:bg-inherit">
              {#each headerRow.cells as cell, i (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
                  {@const hasFilter = hasFilterFieldIds?.has(cell.id) ?? false}
                  <th
                    {...attrs}
                    class={cn(
                      "text-muted-foreground relative h-9 border-r px-2 text-left align-middle font-medium [&:has([role=checkbox])]:pl-3 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                      i === 0 && "border-r-0",
                      hasFilter && "bg-orange-50",
                    )}
                    use:props.resize
                    data-field-id={cell.id}
                  >
                    {#if cell.id === "$select" && !$hasRecord}
                      <Checkbox checked={false} disabled />
                    {:else}
                      <Render of={cell.render()} />
                      {#if !props.resize.disabled}
                        <button
                          class="absolute bottom-0 right-0 top-0 z-10 w-1 cursor-col-resize bg-transparent transition-colors hover:bg-sky-500/50"
                          use:props.resize.drag
                          on:mouseup={() => {
                            const fieldId = cell.id
                            const width = $columnWidths[fieldId]
                            $setFieldWidth.mutate({
                              tableId: $t.id.value,
                              viewId: $viewId,
                              field: fieldId,
                              width,
                            })
                          }}
                        />
                      {/if}
                    {/if}
                  </th>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Header>
      {#if $count}
        <Table.Body {...$tableBodyAttrs} class="flex-1">
          {#each $pageRows as row (row.id)}
            {@const recordId = row.original.id}
            <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
              <ContextMenu.Root>
                <ContextMenu.Trigger>
                  <Table.Row
                    {...rowAttrs}
                    data-state={($selectedDataIds[row.id] || $isRowSelected(recordId)) && "selected"}
                    class="text-foreground group cursor-pointer text-xs transition-none"
                  >
                    {@const record = $store.records.get(recordId)}
                    {@const match = colorSpec && record ? record.match(colorSpec) : false}
                    {@const condition =
                      match && record
                        ? $view.color?.into(undefined)?.getMatchedFieldConditions($t, record)[0]
                        : undefined}
                    {#each row.cells as cell, idx (cell.id)}
                      {@const hasFilter = hasFilterFieldIds?.has(cell.id) ?? false}
                      <Subscribe attrs={cell.attrs()} let:attrs>
                        <Table.Cell
                          class={cn(
                            "border-border relative border-r p-0",
                            (idx === 0 || idx === 1) && "border-r-0",
                            hasFilter && "bg-orange-50",
                            $isSelectedCell(recordId, cell.column.id) && "bg-gray-100",
                          )}
                          {...attrs}
                          on:click={() => {
                            if (cell.id === "$select") {
                              return
                            }

                            gridViewStore.select(readonly, recordId, cell.column.id)
                          }}
                        >
                          {#if idx === 0 && match && condition && "border-l-4"}
                            <div
                              class={cn(
                                "absolute bottom-0 left-0 top-0 h-full w-1",
                                getBgColor(condition.option.color),
                              )}
                            ></div>
                            <!-- content here -->
                          {/if}
                          {#if cell.id === "amount"}
                            <div class="text-right font-medium">
                              <Render of={cell.render()} />
                            </div>
                          {:else if cell.id === "$select"}
                            <div class="flex items-center justify-center">
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
                  <ContextMenu.Item class="text-xs" on:click={() => ($r = recordId)}>
                    <Maximize2Icon class="mr-2 h-4 w-4" />
                    {$LL.table.record.viewRecordDetail()}
                  </ContextMenu.Item>
                  <ContextMenu.Item class="text-xs" on:click={() => copy(recordId)}>
                    <ClipboardCopyIcon class="mr-2 h-4 w-4" />
                    {$LL.table.record.copyRecordId()}
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    class="text-xs"
                    on:click={() => {
                      toggleModal(DUPLICATE_RECORD_MODAL)
                      $duplicateRecordId = recordId
                    }}
                  >
                    <CopyIcon class="mr-2 h-4 w-4" />
                    {$LL.table.record.duplicateRecord()}
                  </ContextMenu.Item>
                  <ContextMenu.Separator />
                  <ContextMenu.Item
                    on:click={() => {
                      toggleModal(DELETE_RECORD_MODAL)
                      $deleteRecordId = recordId
                    }}
                    class="text-xs text-red-500 data-[highlighted]:bg-red-100 data-[highlighted]:text-red-500"
                  >
                    <Trash2Icon class="mr-2 h-4 w-4" />
                    {$LL.table.record.delete()}
                  </ContextMenu.Item>
                </ContextMenu.Content>
              </ContextMenu.Root>
            </Subscribe>
          {/each}
        </Table.Body>

        <tfoot class="text-muted-foreground sticky bottom-0 h-10 w-full border-t bg-white pb-2 text-sm">
          <tr class="flex h-10 w-full">
            {#each $visibleColumns as column}
              {@const width = $columnWidths[column.id]}
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
        </tfoot>
      {:else if !isLoading}
        <GridViewEmpty {readonly} />
      {/if}
    </table>
  </ScrollArea>

  {#if !hidePagination}
    <div class="flex items-center justify-center border-t px-4 py-2">
      <div class="flex flex-1 flex-row items-center">
        <ViewPagination {perPage} bind:currentPage={$currentPage} count={total} />
        <div class="flex items-center gap-2 text-sm">
          <Select.Root
            selected={{ value: perPage, label: String(perPage) }}
            onSelectedChange={(value) => {
              if (value) {
                $preferences.gridViewPerPage = value.value
              }
              $currentPage = null
            }}
          >
            <Select.Trigger value={$preferences.gridViewPerPage} class="min-w-16">
              <Select.Value placeholder="page" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value={1}>1</Select.Item>
              <Select.Item value={10}>10</Select.Item>
              <Select.Item value={50}>50</Select.Item>
              <Select.Item value={100}>100</Select.Item>
            </Select.Content>
          </Select.Root>

          <span class="text-muted-foreground flex-1 text-nowrap text-xs">
            {$LL.table.record.records({ n: total })}
          </span>
        </div>
      </div>
    </div>
  {/if}
</div>
