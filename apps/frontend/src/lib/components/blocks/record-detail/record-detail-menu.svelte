<script lang="ts">
  import { hasPermission } from "$lib/store/space-member.store"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { EllipsisIcon } from "lucide-svelte"
  import { createMutation } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { getTable } from "$lib/store/table.store"
  import { getRecordsStore } from "$lib/store/records.store"
  import type { Writable } from "svelte/store"

  const table = getTable()
  export let r: Writable<string | null>
  const recordsStore = getRecordsStore()

  $: canDelete = $hasPermission("record:delete")

  $: display = canDelete

  const deleteRecordMutation = createMutation({
    mutationFn: trpc.record.delete.mutate,
    onSuccess: () => {
      if ($r) {
        recordsStore.deleteRecord($r)
        $r = null
      }
    },
  })
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
            class="cursor-pointer text-red-500 hover:!bg-red-100 hover:!text-red-500"
            on:click={() => {
              $deleteRecordMutation.mutate({
                id: $r,
                tableId: $table.id.value,
              })
            }}
          >
            Delete record
          </DropdownMenu.Item>
        {/if}
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
{/if}
