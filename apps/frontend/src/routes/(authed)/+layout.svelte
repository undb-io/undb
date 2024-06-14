<script lang="ts">
  import Bell from "lucide-svelte/icons/bell"
  import Package2 from "lucide-svelte/icons/package-2"
  import * as Resizable from "$lib/components/ui/resizable"
  import { type PaneAPI } from "paneforge"
  import { Button } from "$lib/components/ui/button/index.js"
  import CreateTableButton from "$lib/components/blocks/create-table/create-table-button.svelte"
  import TablesNav from "$lib/components/blocks/tables-nav/tables-nav.svelte"
  import type { LayoutData } from "./$types"
  import CreateTableSheet from "$lib/components/blocks/create-table/create-table-sheet.svelte"
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import { shortcut, type ShortcutEventDetail } from "@svelte-put/shortcut"
  import { cn } from "$lib/utils"
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js"
  import { CREATE_TABLE_MODAL, toggleModal } from "$lib/store/modal.store"
  import Command from "$lib/components/blocks/command/command.svelte"
  import { commandOpen } from "$lib/components/blocks/command/command.store"
  import { SearchIcon } from "lucide-svelte"
  import { workspaceMember } from "@undb/authz"
  import { role } from "$lib/store/workspace-member.store"

  export let data: LayoutData

  function handleT(detail: ShortcutEventDetail) {
    toggleModal(CREATE_TABLE_MODAL)
  }

  let panelLeft: PaneAPI
  let collapsed = false
  function handleB(detail: ShortcutEventDetail) {
    collapsed = !collapsed
    if (collapsed) {
      panelLeft.collapse()
    } else {
      panelLeft.expand()
    }
  }

  $: authedDataStore = data.authedDataStore
  $: tables = $authedDataStore.data?.tables?.filter(Boolean) ?? []

  $: member = $authedDataStore.data?.member

  $: role.set(member?.role ?? null)

  $: if (tables && tables?.length !== 0 && !$page.params.tableId) {
    goto(`/t/${tables[0].id}`, { replaceState: true })
  }
</script>

<Resizable.PaneGroup direction="horizontal">
  <Resizable.Pane
    bind:pane={panelLeft}
    onCollapse={() => (collapsed = true)}
    onExpand={() => (collapsed = false)}
    class="bg-muted/40 hidden border-r md:block"
    defaultSize={15}
    minSize={10}
    maxSize={20}
  >
    <div class="flex h-full max-h-screen flex-col gap-2">
      <div class="flex h-14 items-center border-b px-4 lg:h-[60px]">
        <Button
          variant="outline"
          size="sm"
          class="flex w-full items-center justify-between"
          on:click={() => ($commandOpen = true)}
        >
          <span class="inline-flex items-center">
            <SearchIcon class="text-muted-foreground mr-2 h-3 w-3" />
            Search
          </span>
          <span>
            <code class="bg-muted relative rounded border border-gray-300 px-[0.3rem] py-[0.2rem] font-mono text-xs">
              ⌘ + K
            </code>
          </span>
        </Button>
      </div>
      <ScrollArea class={cn(tables.length ? "flex-1" : "")}>
        <TablesNav {tables} />
      </ScrollArea>
      <div class={cn("p-4", tables.length ? "mt-auto" : "")}>
        <CreateTableButton variant={tables.length ? "outline" : "default"} />
      </div>
    </div>
  </Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane class="grid h-screen" defaultSize={85}>
    <slot />
  </Resizable.Pane>
</Resizable.PaneGroup>

<CreateTableSheet />
<Command {tables} />

<svelte:window
  use:shortcut={{
    trigger: [
      {
        key: "t",
        modifier: ["ctrl", "meta"],
        callback: handleT,
      },
      {
        key: "b",
        modifier: ["meta"],
        callback: handleB,
      },
    ],
  }}
/>
