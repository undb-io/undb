<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet"
  import { IMPORT_TEMPLATE_MODAL, isModalOpen, toggleModal, closeModal } from "$lib/store/modal.store"
  import { PackageIcon } from "lucide-svelte"
  import TemplateList from "./template-list.svelte"
</script>

<Sheet.Root open={$isModalOpen(IMPORT_TEMPLATE_MODAL)} onOpenChange={(open) => {
  if (!open) {
    closeModal(IMPORT_TEMPLATE_MODAL)
  }
}}>
  closeModal(IMPORT_TEMPLATE_MODAL)
}}>
  <Sheet.Content class="flex h-[85%] flex-col bg-gray-50" side="bottom">
    <Sheet.Header>
      <Sheet.Title class="flex items-center">
        <PackageIcon class="mr-2 size-5" />
        Create New Base From Template</Sheet.Title
      >
      <Sheet.Description>Select a template to create a new base.</Sheet.Description>
    </Sheet.Header>

    <div class="flex-1 overflow-y-auto">
      <TemplateList />
    </div>
  </Sheet.Content>
</Sheet.Root>
