<script lang="ts">
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { ButtonField, RecordDO } from "@undb/table"
  import { toast } from "svelte-sonner"
  import { gridViewStore } from "../grid-view.store"
  import { Button } from "$lib/components/ui/button"
  import { LoaderCircleIcon } from "lucide-svelte"
  import { recordsStore } from "$lib/store/records.store"
  import { getTable } from "$lib/store/table.store"
  import { objectify } from "radash"

  export let tableId: string
  export let field: ButtonField
  export let recordId: string
  export let record: RecordDO | undefined

  const table = getTable()

  const updateCell = createMutation({
    mutationKey: ["record", tableId, field.id.value, recordId],
    mutationFn: trpc.record.update.mutate,
    async onSuccess(data, variables, context) {
      gridViewStore.exitEditing()
      await recordsStore.invalidateRecord($table, recordId)
    },
    onError(error: Error) {
      toast.error(error.message)
    },
  })

  function handleClick() {
    const option = field.option.into(undefined)
    if (!option) return
    const action = option.action
    if (!action.values.length) return

    $updateCell.mutate({
      tableId,
      id: recordId,
      values: objectify(
        action.values,
        (v) => v.field!,
        (v) => v.value ?? null,
      ),
    })
  }

  $: disabled = record ? field.getIsDisabled($table, record) : false
</script>

<div class={$$restProps.class}>
  <Button disabled={$updateCell.isPending || disabled} on:click={handleClick} size="xs" variant="outline">
    {#if $updateCell.isPending}
      <LoaderCircleIcon className="h-3 w-3 animate-spin" />
    {:else}
      {field.label ?? "Button"}
    {/if}
  </Button>
</div>
