<script lang="ts">
  import * as Command from "$lib/components/ui/command"
  import { shortcut, type ShortcutEventDetail } from "@svelte-put/shortcut"
  import { DatabaseIcon } from "lucide-svelte"
  import { commandOpen } from "./command.store"

  function handleK(e: ShortcutEventDetail) {
    $commandOpen = !$commandOpen
  }

  interface Table {
    id: string
    name: string
  }

  export let tables: Table[] = []
</script>

<Command.Dialog bind:open={$commandOpen}>
  <Command.Input placeholder="Search for tables..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group heading="Tables">
      {#each tables as table}
        <Command.Item>
          <DatabaseIcon class="mr-2 h-4 w-4" />
          {table.name}
        </Command.Item>
      {/each}
    </Command.Group>
  </Command.List>
</Command.Dialog>

<svelte:window
  use:shortcut={{
    trigger: {
      key: "k",
      modifier: ["alt", "ctrl"],
      callback: handleK,
    },
  }}
/>
