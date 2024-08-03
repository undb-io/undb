<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import { DELETE_VIEW, isModalOpen, toggleModal } from "$lib/store/modal.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { viewId, getTable } from "$lib/store/table.store"
  import { toast } from "svelte-sonner"
  import { goto, invalidate } from "$app/navigation"
    import { page } from "$app/stores"

  const table = getTable()

  const deleteViewMutation = createMutation({
    mutationKey: ["table", $viewId, "deleteView"],
    mutationFn: trpc.table.view.delete.mutate,
    async onSuccess(data, variables, context) {
      await invalidate(`table:${$table.id.value}`)
      await goto(`/${$page.params.spaceId}/t/${$table.id.value}`)
    },
    onError(error) {
      toast.error(error.message)
    },
  })

  const deleteView = () => {
    $deleteViewMutation.mutate({ tableId: $table.id.value, viewId: $viewId })
  }
</script>

<AlertDialog.Root open={$isModalOpen(DELETE_VIEW)} onOpenChange={() => toggleModal(DELETE_VIEW)}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you sure to delete view?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete your view.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel on:click={() => toggleModal(DELETE_VIEW)}>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action on:click={deleteView}>Continue</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
