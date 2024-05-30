<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet"
  import CreateRecord from "./create-record.svelte"
  import Button from "$lib/components/ui/button/button.svelte"
  import { createRecordSheetOpen } from "./create-record.store"
  import { formId } from "$lib/store/tab.store"

  let disabled = false
  let dirty = false
</script>

<Sheet.Root
  bind:open={$createRecordSheetOpen}
  onOpenChange={(open) => {
    if (!open && dirty) {
      if (confirm("Are you sure you want to leave this page? You have unsaved changes that will be lost.")) {
        $createRecordSheetOpen = false
      }
    }
  }}
>
  <Sheet.Content class="sm:max-w-1/2 flex w-1/2 flex-col" transitionConfig={{ duration: 50 }}>
    <Sheet.Header>
      <Sheet.Title>Create Record</Sheet.Title>
    </Sheet.Header>

    <div class="flex-1">
      <CreateRecord bind:disabled bind:dirty formId={$formId ?? undefined} />
    </div>

    <Sheet.Footer>
      <Button variant="outline" type="button" on:click={() => ($createRecordSheetOpen = false)}>Cancel</Button>
      <Button type="submit" form="createRecord" {disabled}>Create</Button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
