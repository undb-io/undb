<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet"
  import { IMPORT_TEMPLATE_MODAL, isModalOpen, closeModal, openModal } from "$lib/store/modal.store"
  import { PackageIcon } from "lucide-svelte"
  import TemplateList from "./template-list.svelte"
  import { LL } from "@undb/i18n/client"
  import { getIsPlayground } from "$lib/store/playground.svelte"
  import { onMount } from "svelte"

  let isPlayground = getIsPlayground()

  onMount(() => {
    if (isPlayground) {
      openModal(IMPORT_TEMPLATE_MODAL)
    }
  })
</script>

<Sheet.Root
  open={$isModalOpen(IMPORT_TEMPLATE_MODAL)}
  onOpenChange={(open) => {
    if (!open) {
      closeModal(IMPORT_TEMPLATE_MODAL)
    }
  }}
>
  <Sheet.Content class="flex h-[90%] flex-col bg-gray-50" side="bottom">
    <Sheet.Header>
      <Sheet.Title class="flex items-center">
        <PackageIcon class="mr-2 size-5" />
        {$LL.template.createBase()}
      </Sheet.Title>
      <Sheet.Description>{$LL.template.selectATemplateToCreateABase()}</Sheet.Description>
    </Sheet.Header>

    <div class="flex-1 overflow-y-auto">
      <TemplateList />
    </div>
  </Sheet.Content>
</Sheet.Root>
