<script lang="ts">
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import { PaintBucketIcon } from "lucide-svelte"
  import FiltersEditor from "../filters-editor/filters-editor.svelte"
  import { getTable, viewId } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { invalidate } from "$app/navigation"
  import Badge from "$lib/components/ui/badge/badge.svelte"
  import {
    getIsFilterableFieldType,
    parseValidViewColor,
    type IConditionGroup,
    type IViewColorOptionSchema,
  } from "@undb/table"
  import ColorPicker from "$lib/components/ui/color-picker/color-picker.svelte"
  import { viewColorEditorOpen, viewColorEditorStore } from "./view-color-editor.store"

  const table = getTable()
  $: color = $table.views.getViewById($viewId).color.into(undefined)
  $: count = color?.count ?? 0

  const store = viewColorEditorStore
  $: validValue = $store ? parseValidViewColor($table.schema.fieldMapById, $store) : undefined

  $: $table, store.set(color?.toMaybeConditionGroup())

  const mutation = createMutation({
    mutationKey: ["table", $table.id.value, "setColor"],
    mutationFn: trpc.table.view.setColor.mutate,
    onSuccess: async () => {
      await invalidate(`table:${$table.id.value}`)
      $viewColorEditorOpen = false
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

<Popover.Root bind:open={$viewColorEditorOpen}>
  <Popover.Trigger asChild let:builder>
    <Button variant={count || $viewColorEditorOpen ? "secondary" : "ghost"} builders={[builder]} size="sm">
      <PaintBucketIcon class="mr-2 h-4 w-4" />
      Color
      {#if count}
        <Badge variant="secondary" class="ml-2 rounded-full">{count}</Badge>
      {/if}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[630px] space-y-2 p-0 shadow-2xl" align="start">
    {#if $store?.children.length}
      <div class="text-muted-foreground px-4 py-3 pb-0 text-xs">Color</div>
    {/if}
    <FiltersEditor
      {store}
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
      <Button size="sm" variant="outline" on:click={() => handleSubmit(validValue)} slot="footer">Submit</Button>
    </FiltersEditor>
  </Popover.Content>
</Popover.Root>
