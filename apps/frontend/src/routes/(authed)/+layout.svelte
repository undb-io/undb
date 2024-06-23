<script lang="ts">
  import * as Resizable from "$lib/components/ui/resizable"
  import { type PaneAPI } from "paneforge"
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
  import { role } from "$lib/store/workspace-member.store"
  import { bases as basesStore } from "$lib/store/base.store"
  import NavTools from "$lib/components/blocks/nav/nav-tools.svelte"
  import CreateBaseDialog from "$lib/components/blocks/create-base/create-base-dialog.svelte"

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

  $: indexDataStore = data.indexDataStore
  $: tables = $indexDataStore.data?.tables?.filter(Boolean) ?? []
  $: bases = $indexDataStore.data?.bases?.filter(Boolean) ?? []

  function setBases() {
    basesStore.set(bases)
  }

  $: bases, setBases()

  $: member = $indexDataStore.data?.member

  $: role.set(member?.role ?? null)

  $: if (tables && tables?.length !== 0 && !$page.params.tableId) {
    goto(`/t/${tables[0]?.id}`, { replaceState: true })
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
      <div class="border-b p-4 pb-2">
        <NavTools />
      </div>
      <ScrollArea class={cn(tables.length ? "flex-1" : "")}>
        <TablesNav {tables} {bases} />
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
<CreateBaseDialog />
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
