<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog"
  import { CREATE_DASHBOARD_MODAL, closeModal, isModalOpen } from "$lib/store/modal.store"
  import CreateDashboard from "./create-dialog.svelte"
</script>

<Dialog.Root
  open={$isModalOpen(CREATE_DASHBOARD_MODAL)}
  onOpenChange={(open) => {
    if (!open) {
      closeModal(CREATE_DASHBOARD_MODAL)
    }
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create New Dashboard.</Dialog.Title>

      <CreateDashboard />
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
