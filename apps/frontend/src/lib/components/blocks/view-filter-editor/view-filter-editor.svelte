<script lang="ts">
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import { FilterIcon } from "lucide-svelte"
  import FiltersEditor from "../filters-editor/filters-editor.svelte"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { invalidateAll } from "$app/navigation"
  import { writable } from "svelte/store"
  import Badge from "$lib/components/ui/badge/badge.svelte"
  import {
    parseValidViewFilter,
    type IViewFilterGroup,
    type IViewFilterOptionSchema,
    type MaybeConditionGroup,
  } from "@undb/table"
  import { cn } from "$lib/utils"

  const table = getTable()
  $: filter = $table.views.getViewById().filter.into(undefined)
  $: count = filter?.count ?? 0

  const value = writable<MaybeConditionGroup<IViewFilterOptionSchema> | undefined>()
  $: validValue = $value ? parseValidViewFilter($table.schema.fieldMapById, $value) : undefined

  $: $table, value.set(filter?.toMaybeConditionGroup())

  let open = false

  const client = useQueryClient()

  const mutation = createMutation({
    mutationKey: [$table.id.value, "setFilters"],
    mutationFn: trpc.table.view.setFilter.mutate,
    onSuccess: async () => {
      await invalidateAll()
      await client.invalidateQueries({ queryKey: ["records", $table.id.value] })
      open = false
    },
  })

  const handleSubmit = (filter?: IViewFilterGroup) => {
    if (!filter) return
    $mutation.mutate({
      filter,
      tableId: $table.id.value,
    })
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger asChild let:builder>
    <Button
      variant="ghost"
      builders={[builder]}
      size="sm"
      class={cn(count && "text-foreground bg-orange-100 hover:bg-orange-200")}
    >
      <FilterIcon class="mr-2 h-4 w-4" />
      Filters
      {#if count}
        <Badge variant="secondary" class="ml-2 rounded-full">{count}</Badge>
      {/if}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[630px] space-y-2 p-0 shadow-2xl" align="start">
    {#if $value?.children.length}
      <div class="text-muted-foreground px-4 py-3 pb-0 text-xs">Filters</div>
    {/if}
    <FiltersEditor bind:value={$value} table={$table} on:submit={(e) => handleSubmit(e.detail)}>
      <Button size="xs" on:click={() => handleSubmit(validValue)} slot="footer">Submit</Button>
    </FiltersEditor>
  </Popover.Content>
</Popover.Root>
