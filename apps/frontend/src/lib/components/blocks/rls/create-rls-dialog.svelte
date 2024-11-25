<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog"
  import { CREATE_RLS_MODAL, isModalOpen, toggleModal } from "$lib/store/modal.store"
  import { FingerprintIcon } from "lucide-svelte"
  import CreateRLS from "./create-rls.svelte"
  import { LL } from '@undb/i18n/client'
</script>

<Dialog.Root
  open={$isModalOpen(CREATE_RLS_MODAL)}
  onOpenChange={() => {
    toggleModal(CREATE_RLS_MODAL)
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title class="flex items-center">
        <FingerprintIcon class="mr-2 h-6 w-6" />
        {$LL.table.authz.create()}
      </Dialog.Title>
    </Dialog.Header>

    <CreateRLS />
  </Dialog.Content>
</Dialog.Root>
