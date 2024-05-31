<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog"
  import { CREATE_WEBHOOK_MODAL, closeModal, isModalOpen } from "$lib/store/modal.store"
  import CreateWebhook from "./create-webhook.svelte"
</script>

<Dialog.Root
  open={$isModalOpen(CREATE_WEBHOOK_MODAL)}
  onOpenChange={(open) => {
    if (!open) {
      closeModal(CREATE_WEBHOOK_MODAL)
    }
  }}
>
  <Dialog.Content>
    <CreateWebhook />
  </Dialog.Content>
</Dialog.Root>
