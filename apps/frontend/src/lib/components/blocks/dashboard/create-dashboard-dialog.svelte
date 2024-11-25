<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog"
  import { CREATE_DASHBOARD_MODAL, closeModal, isModalOpen } from "$lib/store/modal.store"
  import CreateDashboard from "./create-dialog.svelte"
  import { LL } from "@undb/i18n/client"

  export let dashboardNames: string[]
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
      <Dialog.Title>{$LL.dashboard.create()}</Dialog.Title>

      <CreateDashboard {dashboardNames} />
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
