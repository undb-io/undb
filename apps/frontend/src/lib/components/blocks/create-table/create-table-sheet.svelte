<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet"
  import CreateTable from "./create-table.svelte"
  import { Button } from "$lib/components/ui/button"
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte"
  import { CREATE_TABLE_MODAL, closeModal, isModalOpen } from "$lib/store/modal.store"
  import { baseId, currentBase } from "$lib/store/base.store"
  import { useIsMutating } from "@tanstack/svelte-query"
  import { LoaderCircleIcon } from "lucide-svelte"
  import { LL } from "@undb/i18n/client"

  const isCreating = useIsMutating({ mutationKey: ["createTable"] })

  export let tableNames: string[]
</script>

<Sheet.Root
  open={$isModalOpen(CREATE_TABLE_MODAL)}
  closeOnOutsideClick={false}
  closeOnEscape={false}
  onOpenChange={(open) => {
    if (!open) {
      closeModal(CREATE_TABLE_MODAL)
      baseId.set(null)
    }
  }}
>
  <Sheet.Content side="left" class="sm:max-w-2/3 lg:max-w-1/2 flex !max-w-none flex-col sm:w-2/3 lg:w-1/2">
    <Sheet.Header>
      <Sheet.Title>
        {$LL.table.common.create()}
      </Sheet.Title>
    </Sheet.Header>

    <ScrollArea class="flex-1">
      <CreateTable {tableNames} />
    </ScrollArea>

    <Sheet.Footer>
      <Button variant="outline" type="button" on:click={() => closeModal(CREATE_TABLE_MODAL)}>
        {$LL.common.cancel()}
      </Button>
      <Button type="submit" disabled={$isCreating > 0} form="createTable">
        {#if $isCreating > 0}
          <LoaderCircleIcon class="mr-2 h-5 w-5 animate-spin" />
          {$LL.common.creating()}
        {:else}
          {$LL.common.create()}
        {/if}
      </Button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
