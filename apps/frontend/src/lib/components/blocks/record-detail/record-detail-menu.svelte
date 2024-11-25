<script lang="ts">
  import { hasPermission } from "$lib/store/space-member.store"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { EllipsisIcon } from "lucide-svelte"
  import { createMutation } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { getTable } from "$lib/store/table.store"
  import { getRecordsStore } from "$lib/store/records.store"
  import type { Writable } from "svelte/store"
  import { LL } from "@undb/i18n/client"
  import { TrashIcon } from "lucide-svelte"
  import { Button } from "$lib/components/ui/button"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"

  const table = getTable()
  export let r: Writable<string | null>
  const recordsStore = getRecordsStore()

  $: canDelete = $hasPermission("record:delete")

  $: display = canDelete

  const deleteRecordMutation = createMutation({
    mutationFn: trpc.record.delete.mutate,
  })

  let open = false
</script>

{#if display}
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <EllipsisIcon class="size-5" />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="w-[200px] font-normal">
      <DropdownMenu.Group>
        {#if canDelete}
          <DropdownMenu.Item
            class="cursor-pointer text-xs text-red-500 hover:!bg-red-100 hover:!text-red-500"
            on:click={() => {
              open = true
            }}
          >
            <TrashIcon class="mr-2 size-4" />
            {$LL.table.record.delete()}
          </DropdownMenu.Item>
        {/if}
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
{/if}

<AlertDialog.Root portal="body" bind:open>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>{$LL.table.record.confirmDeleteRecord()}</AlertDialog.Title>
      <AlertDialog.Description>
        {$LL.table.record.confirmDeleteRecordDescription()}
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>{$LL.common.cancel()}</AlertDialog.Cancel>
      <AlertDialog.Action asChild>
        <Button
          variant="destructive"
          disabled={!$r || $deleteRecordMutation.isPending}
          on:click={async () => {
            const recordId = $r
            if (!recordId) return
            await $deleteRecordMutation.mutateAsync({
              id: recordId,
              tableId: $table.id.value,
            })
            open = false
            r.set(null)

            recordsStore.deleteRecord(recordId)
          }}
        >
          {$LL.common.continue()}
        </Button>
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
