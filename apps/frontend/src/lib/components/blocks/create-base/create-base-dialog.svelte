<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog"
  import { closeModal, CREATE_BASE_MODAL, isModalOpen, toggleModal } from "$lib/store/modal.store"
  import CreateBase from "./create-base.svelte"
  import { LL } from "@undb/i18n/client"

  export let baseNames: string[]
</script>

<Dialog.Root
  open={$isModalOpen(CREATE_BASE_MODAL)}
  onOpenChange={(open) => {
    if (!open) {
      closeModal(CREATE_BASE_MODAL)
    }
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{$LL.base.createBase()}</Dialog.Title>
    </Dialog.Header>

    <CreateBase {baseNames} />
  </Dialog.Content>
</Dialog.Root>
