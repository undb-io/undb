<script lang="ts">
  import { PlusIcon } from "lucide-svelte"
  import * as Sheet from "$lib/components/ui/sheet"
  import type { Readable } from "svelte/store"
  import type { TableDo } from "@undb/table"
  import { Button } from "$lib/components/ui/button"
  import CreateRecord from "../create-record/create-record.svelte"
  import { ScrollArea } from "$lib/components/ui/scroll-area"
  import { formId } from "$lib/store/tab.store"

  export let foreignTable: Readable<TableDo>
  export let onSuccess: (id: string) => void = () => {}

  let open = false
  let disabled = false
  let dirty = false
</script>

<Sheet.Root bind:open>
  <Sheet.Trigger asChild let:builder>
    <Button variant="outline" size="xs" builders={[builder]}>
      <PlusIcon class="mr-1 h-4 w-4" />
      Create New Record
    </Button>
  </Sheet.Trigger>
  <Sheet.Content
    class="sm:max-w-1/2 flex w-1/2 flex-col gap-0 px-0 py-4 transition-all"
    transitionConfig={{ duration: 50 }}
  >
    <Sheet.Header class="border-b px-6 pb-2">
      <Sheet.Title class="flex items-center gap-1">
        <span>
          Create Record for {$foreignTable.name.value}
        </span>

        <span
          class="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20"
        >
          Foreign Table
        </span>
      </Sheet.Title>
    </Sheet.Header>

    <div class="flex-1 overflow-hidden">
      <ScrollArea class="h-full overflow-auto px-6">
        <CreateRecord
          onSuccess={(id) => {
            open = false
            onSuccess(id)
          }}
          table={foreignTable}
          bind:disabled
          bind:dirty
          formId={$formId ?? undefined}
        />
      </ScrollArea>
    </div>

    <Sheet.Footer class="border-t px-6 pt-4">
      <Button variant="outline" type="button" on:click={() => (open = false)}>Cancel</Button>
      <Button type="submit" form="createRecord">Create</Button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
