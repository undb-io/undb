<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog"
  import { CREATE_WEBHOOK_MODAL, closeModal, isModalOpen } from "$lib/store/modal.store"
  import { getTable } from "$lib/store/table.store"
  import CreateWebhook from "./create-webhook.svelte"
  import { LL } from "@undb/i18n/client"

  const table = getTable()
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
    <Dialog.Header>
      <span class="text-md inline-flex">
        {$LL.webhook.create()}
        <strong class="ml-2">
          {$table.name.value}
        </strong>
      </span>
    </Dialog.Header>
    <CreateWebhook />
  </Dialog.Content>
</Dialog.Root>
