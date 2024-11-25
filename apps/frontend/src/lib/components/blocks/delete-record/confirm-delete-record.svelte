<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import { DELETE_RECORD_MODAL, closeModal } from "$lib/store/modal.store"
  import { modal, toggleModal } from "$lib/store/modal.store"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { queryParam } from "sveltekit-search-params"
  import { toast } from "svelte-sonner"
  import Button from "$lib/components/ui/button/button.svelte"
  import { Loader2Icon } from "lucide-svelte"
  import { LL } from "@undb/i18n/client"

  const deleteRecordId = queryParam("deleteRecordId")

  const table = getTable()

  const client = useQueryClient()
  const deleteRecordMutation = createMutation({
    mutationFn: trpc.record.delete.mutate,
    mutationKey: ["record", "delete", $table.id.value],
    async onSettled() {
      closeModal(DELETE_RECORD_MODAL)
      $deleteRecordId = null
      await client.invalidateQueries({
        queryKey: ["records", $table.id.value],
      })
    },
    onError(e) {
      toast.error($LL.table.record.failedToDeleteRecord() + ": " + e.message)
    },
  })

  const onDelete = () => {
    if (!$deleteRecordId) return

    $deleteRecordMutation.mutate({
      id: $deleteRecordId,
      tableId: $table.id.value,
    })
  }
</script>

<AlertDialog.Root
  open={$modal?.includes(DELETE_RECORD_MODAL)}
  onOpenChange={() => {
    toggleModal(DELETE_RECORD_MODAL)
    $deleteRecordId = null
  }}
>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>{$LL.table.record.confirmDeleteRecord()}</AlertDialog.Title>
      <AlertDialog.Description>
        {$LL.table.record.confirmDeleteRecordDescription()}
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel
        on:click={() => {
          closeModal(DELETE_RECORD_MODAL)
          $deleteRecordId = null
        }}
      >
        {$LL.common.cancel()}
      </AlertDialog.Cancel>
      <AlertDialog.Action asChild>
        <Button on:click={onDelete} variant="destructive" disabled={$deleteRecordMutation.isPending}>
          {#if $deleteRecordMutation.isPending}
            <Loader2Icon class="mr-2 size-3 animate-spin" />
          {/if}
          {$LL.common.delete()}
        </Button>
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
