<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet"
  import CreateTable from "./create-table.svelte"
  import { Button } from "$lib/components/ui/button"
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte"
  import { CREATE_TABLE_MODAL, closeModal, isModalOpen } from "$lib/store/modal.store"
  import { baseId, currentBase } from "$lib/store/base.store"
  import { useIsMutating } from "@tanstack/svelte-query"
  import { LoaderCircleIcon } from "lucide-svelte"

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
  <Sheet.Content side="left" class="sm:max-w-1/2 flex w-1/3 flex-col">
    <Sheet.Header>
      <Sheet.Title>
        Create Table
        {#if $currentBase}
          at base {$currentBase.name}
        {/if}
      </Sheet.Title>
    </Sheet.Header>

    <ScrollArea class="flex-1">
      <CreateTable {tableNames} />
    </ScrollArea>

    <Sheet.Footer>
      <Button variant="outline" type="button" on:click={() => closeModal(CREATE_TABLE_MODAL)}>Cancel</Button>
      <Button type="submit" disabled={$isCreating > 0} form="createTable">
        {#if $isCreating > 0}
          <LoaderCircleIcon class="mr-2 h-5 w-5 animate-spin" />
          Creating
        {:else}
          Create
        {/if}
      </Button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
