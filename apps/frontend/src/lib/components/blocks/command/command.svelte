<script lang="ts">
  import * as Command from "$lib/components/ui/command"
  import { shortcut, type ShortcutEventDetail } from "@svelte-put/shortcut"
  import { DatabaseIcon } from "lucide-svelte"
  import { commandOpen } from "./command.store"
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import { LL } from "@undb/i18n/client"

  function handleK(e: ShortcutEventDetail) {
    $commandOpen = !$commandOpen
  }

  interface Table {
    id: string
    name: string
  }

  export let tables: Table[] = []
</script>

<Command.Dialog
  filter={(value, search) => {
    const teamName = tables?.find((item) => item.id === value)?.name?.toLowerCase() || ""
    if (teamName.includes(search)) return 1
    return 0
  }}
  bind:open={$commandOpen}
  closeOnEscape
  closeOnOutsideClick
>
  <Command.Input placeholder={$LL.table.common.search()} />
  <Command.List>
    <Command.Empty>{$LL.table.common.noResultsFound()}</Command.Empty>
    <Command.Group heading={$LL.table.common.tables()}>
      {#each tables as table}
        <Command.Item
          id={table.id}
          value={table.id}
          onSelect={() => {
            goto(`/t/${table.id}`)
            $commandOpen = false
          }}
        >
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
      modifier: ["meta", "ctrl"],
      callback: handleK,
    },
  }}
/>
