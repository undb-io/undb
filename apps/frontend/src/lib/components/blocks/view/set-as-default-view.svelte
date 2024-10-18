<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import { isModalOpen, SET_DEFAULT_VIEW, toggleModal, closeModal } from "$lib/store/modal.store"
  import { trpc } from "$lib/trpc/client"
  import { getTable } from "$lib/store/table.store"
  import { createMutation } from "@tanstack/svelte-query"
  import { derived } from "svelte/store"
  import { invalidateAll } from "$app/navigation"
  import { toast } from "svelte-sonner"
  import { goto } from "$app/navigation"
  import type { Readable } from "svelte/store"

  const table = getTable()
  export let viewId: Readable<string | undefined>
  let view = derived([table, viewId], ([$table, $viewId]) => $table.views.getViewById($viewId))

  const setAsDefaultViewMutation = createMutation({
    mutationFn: trpc.table.view.setDefault.mutate,
    async onSuccess(data, variables, context) {
      closeModal(SET_DEFAULT_VIEW)
      await invalidateAll()
      toast.success("View set as default")
      await goto(`/t/${$table.id.value}`)
    },
    onError(error, variables, context) {
      toast.error(error.message)
    },
  })
</script>

<AlertDialog.Root open={$isModalOpen(SET_DEFAULT_VIEW)} onOpenChange={() => toggleModal(SET_DEFAULT_VIEW)}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Set {$view.name.value} as default view</AlertDialog.Title>
      <AlertDialog.Description>The original view will be replaced.</AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action
        disabled={$setAsDefaultViewMutation.isPending}
        on:click={() => $setAsDefaultViewMutation.mutate({ tableId: $table.id.value, viewId: $viewId })}
      >
        Set as Default View
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
