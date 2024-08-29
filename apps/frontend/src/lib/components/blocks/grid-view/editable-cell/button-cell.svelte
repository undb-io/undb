<script lang="ts">
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { ButtonField } from "@undb/table"
  import { toast } from "svelte-sonner"
  import { gridViewStore } from "../grid-view.store"
  import { Button } from "$lib/components/ui/button"
  import { LoaderCircleIcon } from "lucide-svelte"

  export let tableId: string
  export let field: ButtonField
  export let recordId: string

  const updateCell = createMutation({
    mutationKey: ["record", tableId, field.id.value, recordId],
    mutationFn: trpc.record.update.mutate,
    onSuccess(data, variables, context) {
      gridViewStore.exitEditing()
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
  <Button disabled={$updateCell.isPending} on:click={handleClick} size="xs" variant="outline">
    {#if $updateCell.isPending}
      <LoaderCircleIcon className="h-4 w-4 animate-spin" />
    {:else}
      {field.label ?? "Button"}
    {/if}
  </Button>
</div>
