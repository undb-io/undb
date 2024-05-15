<script lang="ts">
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import { FilterIcon } from "lucide-svelte"
  import FiltersEditor from "../filters-editor/filters-editor.svelte"
  import { parseValidFilter, type IFilterGroup, type MaybeFilterGroup } from "@undb/table"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { invalidateAll } from "$app/navigation"
  import { writable } from "svelte/store"
  import Badge from "$lib/components/ui/badge/badge.svelte"

  const table = getTable()
  $: filter = $table.views.getViewById().filter.into(undefined)
  $: count = filter?.count ?? 0

  const value = writable<MaybeFilterGroup | undefined>()
  $: console.log($value)
  $: validValue = $value ? parseValidFilter($table.schema.fieldMapById, $value) : undefined

  $: $table, value.set(filter?.toMaybeFilterGroup())

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

  const handleSubmit = (filter?: IFilterGroup) => {
    if (!filter) return
    $mutation.mutate({
      filter,
      tableId: $table.id.value,
    })
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger asChild let:builder>
    <Button builders={[builder]} size="sm">
      <FilterIcon class="mr-2 h-4 w-4" />
      Filters
      {#if count}
        <Badge variant="secondary" class="ml-2 rounded-full">{count}</Badge>
      {/if}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[630px] space-y-2 p-0" align="start">
    <div class="text-muted-foreground px-4 py-3 pb-0 text-xs">Filters</div>
    <FiltersEditor bind:value={$value} table={$table} on:submit={(e) => handleSubmit(e.detail)}>
      <Button size="xs" on:click={() => handleSubmit(validValue)} slot="footer">Submit</Button>
    </FiltersEditor>
  </Popover.Content>
</Popover.Root>
