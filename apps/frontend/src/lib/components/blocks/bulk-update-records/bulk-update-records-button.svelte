<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import * as Sheet from "$lib/components/ui/sheet"
  import { PencilIcon } from "lucide-svelte"
  import BulkUpdateRecords from "./bulk-update-records.svelte"
  import { hasPermission } from "$lib/store/space-member.store"
  import { type Writable } from "svelte/store"
  import type { Readable } from "svelte/store"
  export let r: Writable<string | null>
  export let viewId: Readable<string | undefined>
  import { LL } from "@undb/i18n/client"

  let open = false
</script>

{#if $hasPermission("record:update")}
  <Sheet.Root bind:open portal="body">
    <Sheet.Trigger asChild let:builder>
      <Button size="sm" variant="outline" builders={[builder]}>
        <PencilIcon class="mr-2 h-3 w-3" />
        {$LL.table.record.bulkUpdate.button()}
      </Button>
    </Sheet.Trigger>
    <Sheet.Content class="sm:max-w-1/2 flex h-full w-2/3 flex-col gap-0 px-0 pb-0 pt-4 transition-all">
      <Sheet.Header class="border-b px-4 pb-4">
        <Sheet.Title>{$LL.table.record.bulkUpdate.title()}</Sheet.Title>
      </Sheet.Header>

      <BulkUpdateRecords {r} {viewId} onSuccess={() => (open = false)} />
    </Sheet.Content>
  </Sheet.Root>
{/if}
