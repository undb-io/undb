<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet"
  import CreateRecord from "./create-record.svelte"
  import Button from "$lib/components/ui/button/button.svelte"
  import { formId } from "$lib/store/tab.store"
  import { isModalOpen, CREATE_RECORD_MODAL, closeModal } from "$lib/store/modal.store"
  import { ScrollArea } from "$lib/components/ui/scroll-area"
  import { getTable } from "$lib/store/table.store"
  import { useIsMutating } from "@tanstack/svelte-query"
  import { LoaderCircleIcon } from "lucide-svelte"
  import { useMediaQuery } from "$lib/store/media-query.store"
  import { cn } from "$lib/utils"
  import { LL } from "@undb/i18n/client"

  let disabled = false
  let dirty = false

  const table = getTable()

  const isMutating = useIsMutating({
    mutationKey: [$table.id.value, "createRecord"],
  })

  const match = useMediaQuery("(max-width: 768px)")
</script>

<Sheet.Root
  open={$isModalOpen(CREATE_RECORD_MODAL)}
  onOpenChange={(open) => {
    if (!open) {
      closeModal(CREATE_RECORD_MODAL)
    }
    if (!open && dirty) {
      if (confirm("Are you sure you want to leave this page? You have unsaved changes that will be lost.")) {
        closeModal(CREATE_RECORD_MODAL)
      }
    }
  }}
>
  <Sheet.Content
    side={$match ? "bottom" : "right"}
    class={cn("flex flex-col gap-0 px-0 py-4 transition-all", $match ? "h-2/3 w-full" : "sm:max-w-1/2 flex w-1/2")}
    transitionConfig={{ duration: 50 }}
  >
    <Sheet.Header class="border-b px-6 pb-2">
      <Sheet.Title>{$LL.table.record.create()}</Sheet.Title>
    </Sheet.Header>

    <div class="flex-1 overflow-hidden">
      <ScrollArea class="h-full overflow-visible overflow-y-auto">
        <CreateRecord
          onSuccess={() => {
            closeModal(CREATE_RECORD_MODAL)
          }}
          {table}
          bind:disabled
          bind:dirty
          formId={$formId ?? undefined}
        />
      </ScrollArea>
    </div>

    <Sheet.Footer class={cn("border-t px-6 pt-4", $match ? "flex-col space-y-2" : "")}>
      <Button variant="outline" type="button" on:click={() => closeModal(CREATE_RECORD_MODAL)}>
        {$LL.common.cancel()}
      </Button>
      <Button disabled={$isMutating > 0 || disabled} type="submit" form="createRecord">
        {#if $isMutating > 0}
          <LoaderCircleIcon class="mr-2 h-5 w-5 animate-spin" />
        {/if}
        {$LL.common.create()}
      </Button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
