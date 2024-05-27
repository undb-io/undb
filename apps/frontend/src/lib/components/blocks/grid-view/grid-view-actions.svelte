<script lang="ts">
  import Ellipsis from "lucide-svelte/icons/ellipsis"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { Button } from "$lib/components/ui/button"
  import { copyToClipboard } from "@svelte-put/copy"
  import { toast } from "svelte-sonner"
  import { DELETE_RECORD_MODAL, toggleModal } from "$lib/store/modal.store"
  import { queryParam } from "sveltekit-search-params"

  const deleteRecordId = queryParam("deleteRecordId")

  export let id: string

  const copy = async () => {
    await copyToClipboard(id)
    toast.success("Copied record ID to clipboard")
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
      <span class="sr-only">Open menu</span>
      <Ellipsis class="h-4 w-4" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Actions</DropdownMenu.Label>
      <DropdownMenu.Item on:click={copy}>Copy record ID</DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item
      on:click={() => {
        toggleModal(DELETE_RECORD_MODAL)
        $deleteRecordId = id
      }}
      class="text-red-500 data-[highlighted]:bg-red-100 data-[highlighted]:text-red-500"
    >
      Delete Record
    </DropdownMenu.Item>
    <DropdownMenu.Item>View payment details</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
