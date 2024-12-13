<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import { DELETE_VIEW, isModalOpen, toggleModal } from "$lib/store/modal.store"
  import { createMutation } from "@tanstack/svelte-query"
  import { getTable } from "$lib/store/table.store"
  import { toast } from "svelte-sonner"
  import { goto, invalidate } from "$app/navigation"
  import { getDataService } from "$lib/store/data-service.store"
  import { type Readable } from "svelte/store"

  const table = getTable()
  export let viewId: Readable<string | undefined>

  const dataService = getDataService()

  const deleteViewMutation = createMutation({
    mutationKey: ["table", $viewId, "deleteView"],
    mutationFn: dataService.table.view.deleteView,
    async onSuccess(data, variables, context) {
      await invalidate(`undb:table:${$table.id.value}`)
      if (isPlayground) {
        await goto(`/playground/bases/${$table.baseId}/t/${$table.id.value}`, { replaceState: true })
      } else {
        await goto(`/t/${$table.id.value}`, { replaceState: true })
      }
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
