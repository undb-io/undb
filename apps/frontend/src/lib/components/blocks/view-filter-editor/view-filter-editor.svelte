<script lang="ts">
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import { FilterIcon, FilterXIcon } from "lucide-svelte"
  import FiltersEditor from "../filters-editor/filters-editor.svelte"
  import { getTable } from "$lib/store/table.store"
  import { LoaderCircleIcon } from "lucide-svelte"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { invalidate } from "$app/navigation"
  import { writable } from "svelte/store"
  import Badge from "$lib/components/ui/badge/badge.svelte"
  import {
    getIsFilterableFieldType,
    parseValidViewFilter,
    type IViewFilterGroup,
    type IViewFilterOptionSchema,
    type MaybeConditionGroup,
  } from "@undb/table"
  import { hasPermission } from "$lib/store/space-member.store"
  import type { Readable } from "svelte/store"
  import { LL } from "@undb/i18n/client"
  import { getDataService } from "$lib/store/data-service.store"

  export let readonly = false
  export let viewId: Readable<string | undefined>

  const table = getTable()
  $: view = $table.views.getViewById($viewId)
  $: filter = view?.filter.into(undefined)
  $: count = filter?.count ?? 0

  const value = writable<MaybeConditionGroup<IViewFilterOptionSchema> | undefined>()
  $: validValue = $value ? parseValidViewFilter($table.schema, $value) : undefined

  $: $table, value.set(filter?.toMaybeConditionGroup())

  let open = false

  const client = useQueryClient()

  const dataService = getDataService()

  const mutation = createMutation({
    mutationKey: ["table", $table.id.value, "setFilters"],
    mutationFn: dataService.table.view.setFilter,
    onSuccess: async () => {
      await invalidate(`undb:table:${$table.id.value}`)
      await client.invalidateQueries({ queryKey: ["records", $table.id.value] })
      await client.invalidateQueries({ queryKey: ["aggregates", $table.id.value] })
      open = false
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

<Popover.Root bind:open portal="body">
  <Popover.Trigger asChild let:builder>
    <Button
      variant={count || open ? "secondary" : "ghost"}
      builders={[builder]}
      size="sm"
      disabled={!readonly && !$hasPermission("table:update") && (!filter || filter?.isEmpty)}
      {...$$restProps}
    >
      <FilterIcon class="mr-2 h-4 w-4" />
      {$LL.table.common.filters()}
      {#if count}
        <Badge variant="secondary" class="ml-2 rounded-full">{count}</Badge>
      {/if}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[630px] space-y-2 p-0 shadow-2xl" align="start">
    {#if $value?.children.length}
      <div class="text-muted-foreground px-4 py-3 pb-0 text-xs">{$LL.table.common.filters()}</div>
    {/if}
    <FiltersEditor
      {readonly}
      bind:value={$value}
      table={$table}
      on:submit={(e) => handleSubmit(e.detail)}
      filter={(field) => getIsFilterableFieldType(field.type)}
    >
      <Button
        size="sm"
        disabled={readonly || $mutation.isPending}
        variant="outline"
        on:click={() => handleSubmit(validValue)}
        slot="footer"
      >
        {#if $mutation.isPending}
          <LoaderCircleIcon class="mr-2 h-4 w-4 animate-spin" />
        {/if}
        {$LL.table.common.submit()}
      </Button>

      <div slot="empty" class="flex flex-col items-center gap-3 px-4 py-6 text-center">
        <FilterXIcon class="text-primary h-10 w-10" />
        <h3 class="text-muted-foreground text-sm tracking-tight">
          {$LL.table.common.filter.empty()}
        </h3>
      </div>
    </FiltersEditor>
  </Popover.Content>
</Popover.Root>
