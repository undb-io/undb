<script lang="ts">
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import { FilterXIcon, PaintBucketIcon } from "lucide-svelte"
  import FiltersEditor from "../filters-editor/filters-editor.svelte"
  import { getTable } from "$lib/store/table.store"
  import { createMutation } from "@tanstack/svelte-query"
  import { invalidate } from "$app/navigation"
  import { writable } from "svelte/store"
  import Badge from "$lib/components/ui/badge/badge.svelte"
  import {
    getIsFilterableFieldType,
    parseValidViewColor,
    type IConditionGroup,
    type IViewColorOptionSchema,
    type MaybeConditionGroup,
  } from "@undb/table"
  import ColorPicker from "$lib/components/ui/color-picker/color-picker.svelte"
  import { hasPermission } from "$lib/store/space-member.store"
  import type { Readable } from "svelte/store"
  import { LL } from "@undb/i18n/client"
  import { getDataService } from "$lib/store/data-service.store"

  export let readonly = false
  export let viewId: Readable<string | undefined>

  const dataService = getDataService()

  const table = getTable()
  $: color = $table.views.getViewById($viewId).color.into(undefined)
  $: count = color?.count ?? 0

  const value = writable<MaybeConditionGroup<IViewColorOptionSchema> | undefined>()
  $: validValue = $value ? parseValidViewColor($table.schema, $value) : undefined

  $: $table, value.set(color?.toMaybeConditionGroup())

  let open = false

  const mutation = createMutation({
    mutationKey: ["table", $table.id.value, "setColor"],
    mutationFn: dataService.table.view.setColor,
    onSuccess: async () => {
      await invalidate(`undb:table:${$table.id.value}`)
      open = false
    },
  })

  const handleSubmit = (color?: IConditionGroup<IViewColorOptionSchema>) => {
    if (!color) return
    $mutation.mutate({
      color,
      viewId: $viewId,
      tableId: $table.id.value,
    })
  }
</script>

<Popover.Root bind:open portal="body">
  <Popover.Trigger asChild let:builder>
    <Button
      disabled={!readonly && !$hasPermission("table:update") && (!color || color?.isEmpty)}
      variant={count || open ? "secondary" : "ghost"}
      builders={[builder]}
      size="sm"
      {...$$restProps}
    >
      <PaintBucketIcon class="mr-2 h-4 w-4" />
      {$LL.table.common.color()}
      {#if count}
        <Badge variant="secondary" class="ml-2 rounded-full">{count}</Badge>
      {/if}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[630px] space-y-2 p-0 shadow-2xl" align="start">
    {#if $value?.children.length}
      <div class="text-muted-foreground px-4 py-3 pb-0 text-xs">{$LL.table.common.color()}</div>
    {/if}
    <FiltersEditor
      {readonly}
      bind:value={$value}
      table={$table}
      disableGroup
      defaultConjunction="or"
      filter={(f) => getIsFilterableFieldType(f.type)}
    >
      <div slot="option" class="flex items-center justify-center" let:index let:option let:onChange>
        <ColorPicker
          value={option.option?.color}
          onColorChange={(color) => {
            onChange({ color })
          }}
        />
      </div>
      <Button size="sm" variant="outline" on:click={() => handleSubmit(validValue)} slot="footer">
        {$LL.table.common.submit()}
      </Button>
      <div slot="empty" class="flex flex-col items-center gap-3 px-4 py-6 text-center">
        <FilterXIcon class="text-primary h-10 w-10" />
        <h3 class="text-muted-foreground text-sm tracking-tight">{$LL.table.common.colorEmpty()}</h3>
      </div>
    </FiltersEditor>
  </Popover.Content>
</Popover.Root>
