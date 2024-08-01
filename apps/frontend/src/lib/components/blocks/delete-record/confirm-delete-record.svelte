<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import { DELETE_RECORD_MODAL, closeModal } from "$lib/store/modal.store"
  import { modal, toggleModal } from "$lib/store/modal.store"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { queryParam } from "sveltekit-search-params"
  import { toast } from "svelte-sonner"

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
      toast.error("Failed to delete record: " + e.message)
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
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete your record and remove your data from our servers.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel
        on:click={() => {
          closeModal(DELETE_RECORD_MODAL)
          $deleteRecordId = null
        }}
      >
        Cancel
      </AlertDialog.Cancel>
      <AlertDialog.Action class="text-background bg-red-500 hover:bg-red-600" on:click={onDelete}>
        Delete
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
