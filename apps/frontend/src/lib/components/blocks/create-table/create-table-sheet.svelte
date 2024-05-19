<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet"
  import CreateTable from "./create-table.svelte"
  import { createTableOpened } from "./create-table.store"
  import { Button } from "$lib/components/ui/button"
</script>

<Sheet.Root bind:open={$createTableOpened}>
  <Sheet.Content side="left" class="flex flex-col sm:max-w-lg">
    <Sheet.Header>
      <Sheet.Title>Create Table</Sheet.Title>
    </Sheet.Header>

    <div class="flex-1">
      <CreateTable />
    </div>

    <Sheet.Footer>
      <Button variant="outline" type="button" on:click={() => ($createTableOpened = false)}>Cancel</Button>
      <Button type="submit" form="createTable">Create</Button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
