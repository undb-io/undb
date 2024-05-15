<script lang="ts">
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import { PaintBucketIcon } from "lucide-svelte"
  import FiltersEditor from "../filters-editor/filters-editor.svelte"
  import { parseValidFilter, type IFilterGroup, type MaybeFilterGroup } from "@undb/table"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { invalidateAll } from "$app/navigation"
  import { writable } from "svelte/store"
  import Badge from "$lib/components/ui/badge/badge.svelte"

  const table = getTable()
  $: color = $table.views.getViewById().color.into(undefined)
  $: count = color?.count ?? 0

  const value = writable<MaybeFilterGroup | undefined>()
  $: validValue = $value ? parseValidFilter($table.schema.fieldMapById, $value) : undefined

  $: $table, value.set(color?.toMaybeFilterGroup())

  let open = false

  const mutation = createMutation({
    mutationKey: [$table.id.value, "setColor"],
    mutationFn: trpc.table.view.setColor.mutate,
    onSuccess: async () => {
      await invalidateAll()
      open = false
    },
  })

  const handleSubmit = (color?: IFilterGroup) => {
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
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[630px] space-y-2 p-0" align="start">
    <div class="text-muted-foreground px-4 py-3 pb-0 text-xs">Filters</div>
    <FiltersEditor bind:value={$value} table={$table} on:submit={(e) => handleSubmit(e.detail)}>
      <Button size="xs" on:click={() => handleSubmit(validValue)} slot="footer">Submit</Button>
    </FiltersEditor>
  </Popover.Content>
</Popover.Root>
