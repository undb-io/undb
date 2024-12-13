<script lang="ts">
  import * as Resizable from "$lib/components/ui/resizable"
  import { type PaneAPI } from "paneforge"
  import TablesNav from "$lib/components/blocks/tables-nav/tables-nav.svelte"
  import type { LayoutData } from "./$types"
  import CreateTableSheet from "$lib/components/blocks/create-table/create-table-sheet.svelte"
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import { shortcut, type ShortcutEventDetail } from "@svelte-put/shortcut"
  import Command from "$lib/components/blocks/command/command.svelte"
  import { role } from "$lib/store/space-member.store"
  import { baseId, bases as basesStore } from "$lib/store/base.store"
  import NavTools from "$lib/components/blocks/nav/nav-tools.svelte"
  import { onMount } from "svelte"
  import type { ComponentType } from "svelte"
  import ImportTableDialog from "$lib/components/blocks/import-table/import-table-dialog.svelte"
  import MemberMenu from "$lib/components/blocks/member/member-menu.svelte"
  import { derived, get } from "svelte/store"
  import { lastViewedTable, preferences } from "$lib/store/persisted.store"
  import { currentSpaceId } from "$lib/store/space.store"

  export let data: LayoutData

  let panelLeft: PaneAPI
  $: if ($preferences.panelLeftCollapsed) {
    panelLeft?.collapse()
  } else {
    panelLeft?.expand()
  }
  function handleB(detail: ShortcutEventDetail) {
    preferences.update((p) => ({ ...p, panelLeftCollapsed: !p.panelLeftCollapsed }))
    // const panelLeftCollapsed = get(preferences).panelLeftCollapsed
    // if (panelLeftCollapsed) {
    //   panelLeft.collapse()
    // } else {
    //   panelLeft.expand()
    // }
  }

  let indexDataStore = data.indexDataStore
  let me = data.me.user
  let space = derived(indexDataStore, ($indexDataStore) => $indexDataStore.data?.space)
  let tables = derived(indexDataStore, ($indexDataStore) => $indexDataStore.data?.tables?.filter(Boolean) ?? [])
  let dashboards = derived(indexDataStore, ($indexDataStore) => $indexDataStore.data?.dashboards?.filter(Boolean) ?? [])
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

  $: $space && currentSpaceId.set($space.id)

  $: if ($tables && $tables?.length !== 0 && !$page.params.tableId && $page.route.id === "/(authed)/(space)") {
    if ($space) {
      const current = get(lastViewedTable)?.[$space?.id]
      if (current) {
        if (current.viewId) {
          goto(`/t/${current.tableId}/${current.viewId}`, { replaceState: true })
        } else {
          goto(`/t/${current.tableId}`, { replaceState: true })
        }
      }
    } else {
      goto(`/t/${$tables[0]?.id}`, { replaceState: true })
    }
  }
  $: if (!$tables.length && !$dashboards.length && $bases.length && !$page.params.baseId) {
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
    onResize={(size) => ($preferences.panelLeftWidth = size)}
    collapsible
    onCollapse={() => ($preferences.panelLeftCollapsed = true)}
    onExpand={() => ($preferences.panelLeftCollapsed = false)}
    class="bg-muted/40 hidden border-r md:block"
    defaultSize={$preferences.panelLeftWidth ?? 20}
    minSize={15}
    maxSize={30}
  >
    <div class="flex h-full max-h-screen flex-col gap-2">
      <div class="border-b px-4 py-2">
        <NavTools space={$space} me={data.me.user} />
      </div>
      <div class="w-full flex-1 overflow-y-auto">
        <TablesNav tables={$tables} bases={$bases} dashboards={$dashboards} {isLoading} />
      </div>

      <div class="border-t px-4 py-2">
        <MemberMenu user={data.me.user} />
      </div>
    </div>
  </Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane class="grid h-screen" defaultSize={100 - $preferences.panelLeftWidth}>
    <slot />
  </Resizable.Pane>
</Resizable.PaneGroup>

<CreateTableSheet tableNames={$baseTableNames} />
<ImportTableDialog tableNames={$baseTableNames} />
{#if CreateBaseDialog}
  <CreateBaseDialog baseNames={$baseNames} />
{/if}

{#await import("$lib/components/blocks/template/template-list-sheet.svelte") then { default: TemplateListSheet }}
  <TemplateListSheet />
{/await}

{#await import("$lib/components/blocks/dashboard/create-dashboard-dialog.svelte") then { default: CreateDashboardDialog }}
  <CreateDashboardDialog dashboardNames={[]} />
{/await}

<Command tables={$tables} />

<svelte:window
  use:shortcut={{
    trigger: [
      {
        key: "b",
        modifier: ["meta", "ctrl"],
        callback: handleB,
      },
    ],
  }}
/>
