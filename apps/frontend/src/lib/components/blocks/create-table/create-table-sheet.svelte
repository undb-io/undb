<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet"
  import CreateTable from "./create-table.svelte"
  import { Button } from "$lib/components/ui/button"
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte"
  import { CREATE_RLS_MODAL, CREATE_TABLE_MODAL, closeModal, isModalOpen, toggleModal } from "$lib/store/modal.store"
</script>

<Sheet.Root
  open={$isModalOpen(CREATE_TABLE_MODAL)}
  onOpenChange={() => {
    toggleModal(CREATE_TABLE_MODAL)
  }}
>
  <Sheet.Content side="left" class="sm:max-w-1/2 flex w-1/3 flex-col">
    <Sheet.Header>
      <Sheet.Title>Create Table</Sheet.Title>
    </Sheet.Header>

    <ScrollArea class="flex-1">
      <CreateTable />
    </ScrollArea>

    <Sheet.Footer>
      <Button variant="outline" type="button" on:click={() => closeModal(CREATE_RLS_MODAL)}>Cancel</Button>
      <Button type="submit" form="createTable">Create</Button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
