<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet"
  import CreateRecord from "./create-record.svelte"
  import Button from "$lib/components/ui/button/button.svelte"
  import { createRecordSheetOpen } from "./create-record.store"
</script>

<Sheet.Root bind:open={$createRecordSheetOpen}>
  <Sheet.Content class="flex flex-col sm:max-w-lg" transitionConfig={{ duration: 50 }}>
    <Sheet.Header>
      <Sheet.Title>Create Record</Sheet.Title>
    </Sheet.Header>

    <div class="flex-1">
      <CreateRecord />
    </div>

    <Sheet.Footer>
      <Button variant="outline" type="button" on:click={() => ($createRecordSheetOpen = false)}>Cancel</Button>
      <Button type="submit" form="createRecord">Create</Button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
