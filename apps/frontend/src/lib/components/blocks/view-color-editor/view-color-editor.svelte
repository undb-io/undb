<script lang="ts">
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import { PaintBucketIcon } from "lucide-svelte"
  import FiltersEditor from "../filters-editor/filters-editor.svelte"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { invalidateAll } from "$app/navigation"
  import { writable } from "svelte/store"
  import Badge from "$lib/components/ui/badge/badge.svelte"
  import {
    parseValidViewColor,
    type IConditionGroup,
    type IViewColorOption,
    type MaybeConditionGroup,
  } from "@undb/table"
  import ColorPicker from "$lib/components/ui/color-picker/color-picker.svelte"

  const table = getTable()
  $: color = $table.views.getViewById().color.into(undefined)
  $: count = color?.count ?? 0

  const value = writable<MaybeConditionGroup<IViewColorOption> | undefined>()
  $: validValue = $value ? parseValidViewColor($table.schema.fieldMapById, $value) : undefined
  $: console.log($value, validValue)

  $: $table, value.set(color?.toMaybeConditionGroup())

  let open = false

  const mutation = createMutation({
    mutationKey: [$table.id.value, "setColor"],
    mutationFn: trpc.table.view.setColor.mutate,
    onSuccess: async () => {
      await invalidateAll()
      open = false
    },
  })

  const handleSubmit = (color?: IConditionGroup<IViewColorOption>) => {
    if (!color) return
    $mutation.mutate({
      color,
      tableId: $table.id.value,
    })
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger asChild let:builder>
    <Button builders={[builder]} size="sm">
      <PaintBucketIcon class="mr-2 h-4 w-4" />
      Color
      {#if count}
        <Badge variant="secondary" class="ml-2 rounded-full">{count}</Badge>
      {/if}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[630px] space-y-2 p-0" align="start">
    <div class="text-muted-foreground px-4 py-3 pb-0 text-xs">Filters</div>
    <FiltersEditor bind:value={$value} table={$table} disableNested>
      <div slot="option" class="flex items-center justify-center" let:option let:onChange>
        <ColorPicker
          value={option.option?.color}
          onColorChange={(color) => {
            onChange({ color })
          }}
        />
      </div>
      <Button size="xs" on:click={() => handleSubmit(validValue)} slot="footer">Submit</Button>
    </FiltersEditor>
  </Popover.Content>
</Popover.Root>
