<script lang="ts">
  import type { GetBaseQuery$result } from "$houdini"
  import * as Dialog from "$lib/components/ui/dialog"
  import { UPDATE_BASE_MODAL, isModalOpen, toggleModal } from "$lib/store/modal.store"
  import UpdateBase from "./update-base.svelte"

  export let base: GetBaseQuery$result["base"]
</script>

<Dialog.Root
  open={$isModalOpen(UPDATE_BASE_MODAL)}
  onOpenChange={() => {
    toggleModal(UPDATE_BASE_MODAL)
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Update Base</Dialog.Title>
    </Dialog.Header>

    <UpdateBase {base} />
  </Dialog.Content>
</Dialog.Root>
