<script lang="ts">
  import { trpc } from "$lib/trpc/client"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { ButtonField, FieldIdVo, FieldValueFactory, RecordDO } from "@undb/table"
  import { toast } from "svelte-sonner"
  import { Button } from "$lib/components/ui/button"
  import { LoaderCircleIcon } from "lucide-svelte"
  import { getTable } from "$lib/store/table.store"
  import { gridViewStore } from "../grid-view/grid-view.store"
  import { getRecordsStore } from "$lib/store/records.store"

  export let tableId: string
  export let field: ButtonField
  export let recordId: string
  export let record: RecordDO | undefined

  const table = getTable()

  const client = useQueryClient()
  const recordsStore = getRecordsStore()

  const updateCell = createMutation({
    mutationKey: ["record", tableId, field.id.value, recordId],
    mutationFn: trpc.record.update.mutate,
    async onSuccess(data, variables, context) {
      gridViewStore.exitEditing()
      await recordsStore?.invalidateRecord($table, recordId)
      await client.invalidateQueries({ queryKey: [recordId, "get"] })
    },
    onError(error: Error) {
      toast.error(error.message)
    },
  })

  function handleClick(e: Event) {
    e.stopPropagation()
    const option = field.option.into(undefined)
    if (!option) return
    const action = option.action
    if (!action.values.length) return

    for (const value of action.values) {
      if (!value.field) continue
      const field = $table.schema.getFieldById(new FieldIdVo(value.field)).unwrap()
      if (record) {
        record.values.setValue(field.id, FieldValueFactory.fromJSON(field, value.value ?? null).unwrap())
      }
    }
  }
</script>

<div class={$$restProps.class}>
  <Button disabled={$updateCell.isPending} on:click={handleClick} variant="outline" class="w-full" size="sm">
    {#if $updateCell.isPending}
      <LoaderCircleIcon className="h-5 w-5 animate-spin" />
    {:else}
      {field.label ?? "Button"}
    {/if}
  </Button>
</div>
