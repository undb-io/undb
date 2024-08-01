<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import { DUPLICATE_RECORD_MODAL, toggleModal, modal, closeModal } from "$lib/store/modal.store"
  import { queryParam } from "sveltekit-search-params"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { toast } from "svelte-sonner"

  const table = getTable()

  const duplicateRecordId = queryParam("duplicateRecordId")

  const client = useQueryClient()
  const duplciateRecordMutation = createMutation({
    mutationFn: trpc.record.duplicate.mutate,
    onError() {
      toast.error("Failed to duplicate record")
    },
    async onSuccess() {
      await client.invalidateQueries({
        queryKey: ["records", $table.id.value],
      })
    },
    onSettled() {
      closeModal(DUPLICATE_RECORD_MODAL)
      $duplicateRecordId = null
    },
  })

  const duplicateRecord = () => {
    if (!$duplicateRecordId) return

    $duplciateRecordMutation.mutate({
      tableId: $table.id.value,
      id: $duplicateRecordId,
    })
  }
</script>

<AlertDialog.Root
  open={$modal?.includes(DUPLICATE_RECORD_MODAL)}
  onOpenChange={() => {
    toggleModal(DUPLICATE_RECORD_MODAL)
    $duplicateRecordId = null
  }}
>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Duplicate Record</AlertDialog.Title>
      <AlertDialog.Description>
        A new record with new id will be created. Are you sure you want to continue?
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel
        on:click={() => {
          toggleModal(DUPLICATE_RECORD_MODAL)
          $duplicateRecordId = null
        }}>Cancel</AlertDialog.Cancel
      >
      <AlertDialog.Action
        on:click={() => {
          duplicateRecord()
        }}>Continue</AlertDialog.Action
      >
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
