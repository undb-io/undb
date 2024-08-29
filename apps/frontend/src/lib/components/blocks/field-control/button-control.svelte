<script lang="ts">
  import { trpc } from "$lib/trpc/client"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { ButtonField } from "@undb/table"
  import { toast } from "svelte-sonner"
  import { Button } from "$lib/components/ui/button"
  import { LoaderCircleIcon } from "lucide-svelte"
  import { recordsStore } from "$lib/store/records.store"
  import { getTable } from "$lib/store/table.store"
  import { gridViewStore } from "../grid-view/grid-view.store"

  export let tableId: string
  export let field: ButtonField
  export let recordId: string

  const table = getTable()

  const client = useQueryClient()


  const updateCell = createMutation({
    mutationKey: ["record", tableId, field.id.value, recordId],
    mutationFn: trpc.record.update.mutate,
    async onSuccess(data, variables, context) {
      gridViewStore.exitEditing()
      await recordsStore.invalidateRecord($table, recordId)
      await client.invalidateQueries({ queryKey: [recordId, 'get'] })
    },
    onError(error: Error) {
      toast.error(error.message)
    },
  })

  function handleClick() {
    const option = field.option.into(undefined)
    if (!option) return
    const action = option.action
    if (!action.field) return

    $updateCell.mutate({
      tableId,
      id: recordId,
      values: {
        [action.field]: action.value,
      },
    })
  }
</script>

<div class={$$restProps.class}>
  <Button disabled={$updateCell.isPending} on:click={handleClick} variant="outline" class="w-full">
    {#if $updateCell.isPending}
      <LoaderCircleIcon className="h-5 w-5 animate-spin" />
    {:else}
      {field.label ?? "Button"}
    {/if}
  </Button>
</div>
