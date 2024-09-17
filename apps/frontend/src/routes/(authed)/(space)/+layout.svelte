<script lang="ts">
  import * as Resizable from "$lib/components/ui/resizable"
  import { type PaneAPI } from "paneforge"
  import TablesNav from "$lib/components/blocks/tables-nav/tables-nav.svelte"
  import type { LayoutData } from "./$types"
  import CreateTableSheet from "$lib/components/blocks/create-table/create-table-sheet.svelte"
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import { shortcut, type ShortcutEventDetail } from "@svelte-put/shortcut"
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js"
  import { CREATE_TABLE_MODAL, toggleModal } from "$lib/store/modal.store"
  import Command from "$lib/components/blocks/command/command.svelte"
  import { role } from "$lib/store/space-member.store"
  import { baseId, bases as basesStore } from "$lib/store/base.store"
  import NavTools from "$lib/components/blocks/nav/nav-tools.svelte"
  import { onMount } from "svelte"
  import type { ComponentType } from "svelte"
  import ImportTableDialog from "$lib/components/blocks/import-table/import-table-dialog.svelte"
  import MemberMenu from "$lib/components/blocks/member/member-menu.svelte"
  import { derived } from "svelte/store"

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

  let indexDataStore = data.indexDataStore
  let me = data.me.user
  let space = derived(indexDataStore, ($indexDataStore) => $indexDataStore.data?.space)
  let tables = derived(indexDataStore, ($indexDataStore) => $indexDataStore.data?.tables?.filter(Boolean) ?? [])
  let bases = derived(indexDataStore, ($indexDataStore) => $indexDataStore.data?.bases?.filter(Boolean) ?? [])
  let baseNames = derived(bases, ($bases) => $bases.map((base) => base?.name).filter(Boolean) as string[])
  let baseTables = derived([tables, page, baseId], ([$tables, $page, $baseId]) =>
    $tables.filter((table) => table?.baseId === $page.params.baseId || table?.baseId === $baseId),
  )
  let baseTableNames = derived(
    baseTables,
    ($baseTables) => $baseTables.map((table) => table?.name).filter(Boolean) as string[],
  )

  $: isLoading = $indexDataStore.fetching

  function setBases() {
    basesStore.set($bases)
  }

  $: bases, setBases()

  $: member = $indexDataStore.data?.member

  $: role.set(member?.role ?? null)

  $: if ($tables && $tables?.length !== 0 && !$page.params.tableId && $page.route.id === "/(authed)/(space)") {
    goto(`/t/${$tables[0]?.id}`, { replaceState: true })
  }
  $: if (!$tables.length && $bases.length && !$page.params.baseId) {
    goto(`/bases/${$bases[0]?.id}`, { replaceState: true })
  }

  $: if ($page.params.tableId && !$tables.find((table) => table?.id === $page.params.tableId)) {
    // goto("/", { replaceState: true })
  }

  let CreateBaseDialog: ComponentType
  onMount(async () => {
    CreateBaseDialog = (await import("$lib/components/blocks/create-base/create-base-dialog.svelte")).default
  })
</script>

<Resizable.PaneGroup direction="horizontal">
  <Resizable.Pane
    bind:pane={panelLeft}
    onCollapse={() => (collapsed = true)}
    onExpand={() => (collapsed = false)}
    class="bg-muted/40 hidden border-r md:block"
    defaultSize={20}
    minSize={15}
    maxSize={30}
  >
    <div class="flex h-full max-h-screen flex-col gap-2">
      <div class="border-b px-4 py-2">
        <NavTools space={$space} me={data.me.user} />
      </div>
      <ScrollArea class="flex-1">
        <TablesNav tables={$tables} bases={$bases} {isLoading} />
      </ScrollArea>

      <div class="border-t px-4 py-2">
        <MemberMenu user={data.me.user} />
      </div>
    </div>
  </Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane class="grid h-screen" defaultSize={85}>
    <slot />
  </Resizable.Pane>
</Resizable.PaneGroup>

<CreateTableSheet tableNames={$baseTableNames} />
<ImportTableDialog tableNames={$baseTableNames} />
{#if CreateBaseDialog}
  <CreateBaseDialog baseNames={$baseNames} />
{/if}
<Command tables={$tables} />

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
