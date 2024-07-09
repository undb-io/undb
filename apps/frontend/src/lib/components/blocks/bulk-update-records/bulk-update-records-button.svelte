<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import * as Sheet from "$lib/components/ui/sheet"
  import { PencilIcon } from "lucide-svelte"
  import BulkUpdateRecords from "./bulk-update-records.svelte"
</script>

<Sheet.Root>
  <Sheet.Trigger asChild let:builder>
    <Button size="sm" variant="outline" builders={[builder]}>
      <PencilIcon class="mr-2 h-3 w-3" />
      Bulk Update
    </Button>
  </Sheet.Trigger>
  <Sheet.Content class="sm:max-w-1/2 flex h-full w-1/2 flex-col gap-0 px-0 pt-4 transition-all">
    <Sheet.Header class="border-b px-4 pb-4">
      <Sheet.Title>Bulk Update Records</Sheet.Title>
    </Sheet.Header>

    <BulkUpdateRecords />
  </Sheet.Content>
</Sheet.Root>
