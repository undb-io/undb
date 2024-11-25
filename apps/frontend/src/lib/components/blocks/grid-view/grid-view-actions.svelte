<script lang="ts">
  import Ellipsis from "lucide-svelte/icons/ellipsis"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { Button } from "$lib/components/ui/button"
  import { copyToClipboard } from "@svelte-put/copy"
  import { toast } from "svelte-sonner"
  import { DELETE_RECORD_MODAL, DUPLICATE_RECORD_MODAL, toggleModal } from "$lib/store/modal.store"
  import { queryParam } from "sveltekit-search-params"
  import { ClipboardCopyIcon, CopyIcon, Maximize2Icon, Trash2Icon } from "lucide-svelte"
  import type { Writable } from "svelte/store"
  import { LL } from "@undb/i18n/client"

  const deleteRecordId = queryParam("deleteRecordId")
  const duplicateRecordId = queryParam("duplicateRecordId")
  export let r: Writable<string | null>

  export let id: string

  export let readonly = false

  const copy = async () => {
    await copyToClipboard(id)
    toast.success($LL.table.record.copiedRecordId())
  }
</script>

<div class="pl-1">
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
      <Button variant="ghost" builders={[builder]} size="icon" class="relative h-6 w-6 p-0">
        <span class="sr-only">{$LL.table.record.openMenu()}</span>
        <Ellipsis class="h-3 w-3" />
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Group>
        <DropdownMenu.Label>{$LL.table.record.label()}</DropdownMenu.Label>
        <DropdownMenu.Item class="text-xs" on:click={() => ($r = id)}>
          <Maximize2Icon class="mr-2 h-4 w-4" />
          {$LL.table.record.viewRecordDetail()}
        </DropdownMenu.Item>
        <DropdownMenu.Item class="text-xs" on:click={copy}>
          <ClipboardCopyIcon class="mr-2 h-4 w-4" />
          {$LL.table.record.copyRecordId()}
        </DropdownMenu.Item>
        {#if !readonly}
          <DropdownMenu.Item
            class="text-xs"
            on:click={() => {
              toggleModal(DUPLICATE_RECORD_MODAL)
              $duplicateRecordId = id
            }}
          >
            <CopyIcon class="mr-2 h-4 w-4" />
            {$LL.table.record.duplicateRecord()}
          </DropdownMenu.Item>
        {/if}
      </DropdownMenu.Group>
      {#if !readonly}
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          on:click={() => {
            toggleModal(DELETE_RECORD_MODAL)
            $deleteRecordId = id
          }}
          class="text-xs text-red-500 data-[highlighted]:bg-red-100 data-[highlighted]:text-red-500"
        >
          <Trash2Icon class="mr-2 h-4 w-4" />
          {$LL.table.record.delete()}
        </DropdownMenu.Item>
      {/if}
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>
