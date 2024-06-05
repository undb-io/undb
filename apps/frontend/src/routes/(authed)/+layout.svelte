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

  $: tablesStore = data.tablesStore
  $: tables = $tablesStore.data?.tables?.filter(Boolean) ?? []

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
      <div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <a href="/" class="flex items-center gap-2 font-semibold">
          <Package2 class="h-6 w-6" />
          <span class="">Acme Inc</span>
        </a>
        <Button variant="outline" size="icon" class="ml-auto h-8 w-8">
          <Bell class="h-4 w-4" />
          <span class="sr-only">Toggle notifications</span>
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
