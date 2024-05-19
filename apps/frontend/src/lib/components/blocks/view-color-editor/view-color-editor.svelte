<script lang="ts">
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import { PaintBucketIcon } from "lucide-svelte"
  import FiltersEditor from "../filters-editor/filters-editor.svelte"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { invalidate } from "$app/navigation"
  import { writable } from "svelte/store"
  import Badge from "$lib/components/ui/badge/badge.svelte"
  import { cn } from "$lib/utils.js"
  import {
    parseValidViewColor,
    type IConditionGroup,
    type IViewColorOptionSchema,
    type MaybeConditionGroup,
  } from "@undb/table"
  import ColorPicker from "$lib/components/ui/color-picker/color-picker.svelte"

  const table = getTable()
  $: color = $table.views.getViewById().color.into(undefined)
  $: count = color?.count ?? 0

  const value = writable<MaybeConditionGroup<IViewColorOptionSchema> | undefined>()
  $: validValue = $value ? parseValidViewColor($table.schema.fieldMapById, $value) : undefined

  $: $table, value.set(color?.toMaybeConditionGroup())

  let open = false

  const mutation = createMutation({
    mutationKey: [$table.id.value, "setColor"],
    mutationFn: trpc.table.view.setColor.mutate,
    onSuccess: async () => {
      await invalidate(`table:${$table.id.value}`)
      open = false
    },
  })

  const handleSubmit = (color?: IConditionGroup<IViewColorOptionSchema>) => {
    if (!color) return
    $mutation.mutate({
      color,
      tableId: $table.id.value,
    })
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger asChild let:builder>
    <Button variant="ghost" builders={[builder]} size="sm" class={cn(count && "bg-sky-100 hover:bg-sky-200")}>
      <PaintBucketIcon class="mr-2 h-4 w-4" />
      Color
      {#if count}
        <Badge variant="secondary" class="ml-2 rounded-full">{count}</Badge>
      {/if}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[630px] space-y-2 p-0 shadow-2xl" align="start">
    {#if $value?.children.length}
      <div class="text-muted-foreground px-4 py-3 pb-0 text-xs">Color</div>
    {/if}
    <FiltersEditor bind:value={$value} table={$table} disableGroup defaultConjunction="or">
      <div slot="option" class="flex items-center justify-center" let:index let:option let:onChange>
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
