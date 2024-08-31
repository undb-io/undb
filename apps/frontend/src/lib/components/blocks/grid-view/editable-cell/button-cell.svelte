<script lang="ts">
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { ButtonField, FieldIdVo, RecordDO } from "@undb/table"
  import { toast } from "svelte-sonner"
  import { gridViewStore } from "../grid-view.store"
  import { Button } from "$lib/components/ui/button"
  import { LoaderCircleIcon } from "lucide-svelte"
  import { recordsStore } from "$lib/store/records.store"
  import { getTable } from "$lib/store/table.store"
  import { objectify } from "radash"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import FieldPicker from "../../field-picker/field-picker.svelte"
  import FieldControl from "../../field-control/field-control.svelte"

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
    if (field.shouldConfirm) {
      confirm = true
    } else {
      handleUpdate()
    }
  }

  function handleUpdate() {
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

  let confirm = false
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

<AlertDialog.Root bind:open={confirm}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Confirm to update</AlertDialog.Title>
      <AlertDialog.Description>The following fields will be updated when you click the button.</AlertDialog.Description>
    </AlertDialog.Header>

    {#if field.option.isSome()}
      {#each field.option.unwrap().action.values as value}
        {@const field = value.field ? $table.schema.getFieldById(new FieldIdVo(value.field)).unwrap() : undefined}
        <div class="flex items-center gap-2">
          <FieldPicker value={value.field} disabled />
          {#if field}
            <FieldControl
              class="text-xs"
              placeholder="Value to update..."
              value={value.value}
              {field}
              disabled
              readonly
              tableId={$table.id.value}
            />
          {/if}
        </div>
      {/each}
    {/if}

    <AlertDialog.Footer>
      <AlertDialog.Cancel on:click={() => (confirm = false)}>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action on:click={handleUpdate}>Continue</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
