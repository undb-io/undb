<script lang="ts">
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import { FilterIcon } from "lucide-svelte"
  import FiltersEditor from "../filters-editor/filters-editor.svelte"
  import { getTable, viewId } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { invalidate } from "$app/navigation"
  import Badge from "$lib/components/ui/badge/badge.svelte"
  import { getIsFilterableFieldType, parseValidViewFilter, type IViewFilterGroup } from "@undb/table"
  import { viewConditionEditorStore, viewConditionEditorOpen } from "./view-filter-editor.store"

  const table = getTable()
  $: filter = $table.views.getViewById($viewId).filter.into(undefined)
  $: count = filter?.count ?? 0

  const store = viewConditionEditorStore
  $: validValue = $store ? parseValidViewFilter($table.schema.fieldMapById, $store) : undefined

  $: $table, store.set(filter?.toMaybeConditionGroup())

  $: visibleFields = $table.getOrderedVisibleFields()

  const client = useQueryClient()

  const mutation = createMutation({
    mutationKey: ["table", $table.id.value, "setFilters"],
    mutationFn: trpc.table.view.setFilter.mutate,
    onSuccess: async () => {
      await invalidate(`table:${$table.id.value}`)
      await client.invalidateQueries({ queryKey: ["records", $table.id.value] })
      $viewConditionEditorOpen = false
    },
  })

  const handleSubmit = (filter?: IViewFilterGroup) => {
    if (!filter) return
    $mutation.mutate({
      filter,
      viewId: $viewId,
      tableId: $table.id.value,
    })
  }
</script>

<Popover.Root bind:open={$viewConditionEditorOpen}>
  <Popover.Trigger asChild let:builder>
    <Button variant={count || $viewConditionEditorOpen ? "secondary" : "ghost"} builders={[builder]} size="sm">
      <FilterIcon class="mr-2 h-4 w-4" />
      Filters
      {#if count}
        <Badge variant="secondary" class="ml-2 rounded-full">{count}</Badge>
      {/if}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[630px] space-y-2 p-0 shadow-2xl" align="start">
    {#if $store?.children.length}
      <div class="text-muted-foreground px-4 py-3 pb-0 text-xs">Filters</div>
    {/if}
    <FiltersEditor
      {store}
      table={$table}
      on:submit={(e) => handleSubmit(e.detail)}
      filter={(field) => visibleFields.some((f) => f.id.value === field.id) && getIsFilterableFieldType(field.type)}
    >
      <Button size="sm" variant="outline" on:click={() => handleSubmit(validValue)} slot="footer">Submit</Button>
    </FiltersEditor>
  </Popover.Content>
</Popover.Root>
