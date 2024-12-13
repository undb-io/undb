<script lang="ts">
  import { onMount } from "svelte"
  import * as Resizable from "$lib/components/ui/resizable"
  import type { PageData } from "./$types"
  import { goto } from "$app/navigation"
  import { type PaneAPI } from "paneforge"
  import { cn } from "$lib/utils"
  import * as Collapsible from "$lib/components/ui/collapsible"
  import {
    ChevronRightIcon,
    CopyPlusIcon,
    DatabaseIcon,
    EllipsisIcon,
    GaugeIcon,
    PencilIcon,
    ViewIcon,
  } from "lucide-svelte"
  import { page } from "$app/stores"
  import CreateViewButton from "$lib/components/blocks/view/create-view-button.svelte"
  import { LL } from "@undb/i18n/client"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js"
  import { DELETE_VIEW, DUPLICATE_VIEW, SET_DEFAULT_VIEW, toggleModal, UPDATE_VIEW } from "$lib/store/modal.store"
  import PlaygroundMenubar from "$lib/components/blocks/playground/playground-menubar.svelte"

  export let data: PageData

  $: isLoggedIn = !!data.me
  $: bases = data.bases
  $: base = data.base
  $: tables = data.tables
  $: dashboards = data.dashboards

  $: paramBaseId = $page.params.baseId
  $: dashboardId = $page.params.dashboardId
  $: tableId = $page.params.tableId
  $: viewId = $page.params.viewId

  let panelLeft: PaneAPI

  function redirect() {
    if (dashboards.length) {
      goto(`/playground/bases/${base.id}/d/${dashboards[0].id}`, { replaceState: true })
    } else if (tables.length) {
      goto(`/playground/bases/${base.id}/t/${tables[0].id}`, { replaceState: true })
      open[tables[0].id] = true
    }
  }

  $: if (paramBaseId) redirect()

  const SIZE = 20
  const RIGHT_SIZE = 100 - SIZE

  let open = {} as Record<string, boolean>
</script>

<main class="flex flex-1 flex-col overflow-hidden">
  <PlaygroundMenubar {bases} {isLoggedIn} />
  <Resizable.PaneGroup class="flex-1" direction="horizontal">
    <Resizable.Pane
      bind:pane={panelLeft}
      collapsible
      class="bg-muted/40 hidden border-r md:block"
      defaultSize={SIZE}
      minSize={15}
      maxSize={30}
    >
      <nav class="flex h-full flex-col p-2">
        <Collapsible.Root open={true}>
          <Collapsible.Content class="space-y-1 pt-1">
            {#each dashboards as dashboard}
              {@const active = dashboard.id === dashboardId}
              <div
                class={cn(
                  "group flex h-8 cursor-pointer items-center justify-between gap-1 truncate rounded-md pl-2 pr-2 transition-all",
                  active ? "bg-gray-800/90" : "hover:bg-gray-100",
                )}
              >
                <a
                  href={`/playground/bases/${base.id}/d/${dashboard.id}`}
                  class={cn(
                    "flex h-full flex-1 items-center overflow-hidden text-sm font-normal text-gray-600",
                    active && "text-background font-medium",
                  )}
                >
                  <GaugeIcon class="mr-2 h-4 w-4" />
                  {dashboard.name}
                </a>
              </div>
            {/each}
            {#each tables as table}
              {@const active = table.id === tableId && !viewId}
              <Collapsible.Root bind:open={open[table.id]}>
                <div
                  class={cn(
                    "group flex h-8 cursor-pointer items-center justify-between gap-1 truncate rounded-md pl-2 pr-2 transition-all",
                    active ? "bg-gray-800/90" : "hover:bg-gray-100",
                  )}
                >
                  <a
                    href={`/playground/bases/${base.id}/t/${table.id}`}
                    title={table.name}
                    class={cn(
                      "flex h-full flex-1 items-center overflow-hidden text-sm font-normal text-gray-600",
                      active && "text-background font-medium",
                    )}
                  >
                    <DatabaseIcon class="mr-2 h-4 w-4" />
                    <span class="truncate">
                      {table.name}
                    </span>
                  </a>
                  <div class="flex items-center gap-2 opacity-0 transition-all group-hover:opacity-100">
                    <Collapsible.Trigger
                      on:click={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        open[table.id] = !open[table.id]
                      }}
                      class={cn(
                        "flex h-5 w-5 items-center justify-center rounded-md hover:bg-gray-200",
                        active && !viewId && "hover:bg-primary",
                      )}
                    >
                      <ChevronRightIcon
                        class={cn(
                          "text-muted-foreground h-4 w-4 transition-all",
                          open[table.id] && "rotate-90",
                          active && "text-background",
                        )}
                      />
                    </Collapsible.Trigger>
                  </div>
                </div>
                <Collapsible.Content>
                  <CreateViewButton
                    tableId={table.id}
                    viewNames={table.views.map((v) => v.name)}
                    variant="link"
                    class="mt-0 h-8 p-0 pl-14 text-xs"
                  >
                    <span class="text-xs font-normal">+ {$LL.table.view.create()}</span>
                  </CreateViewButton>

                  {#each table.views.filter((view) => !view.isDefault) as view}
                    {@const active = view.id === viewId}
                    <div
                      class={cn(
                        "group flex h-8 items-center justify-between gap-1 rounded-sm pl-14 pr-2 transition-all",
                        active ? "bg-gray-800/90" : "hover:bg-gray-100",
                      )}
                    >
                      <a
                        class={cn(
                          "flex h-full flex-1 items-center text-xs font-normal",
                          active && "text-background font-medium",
                        )}
                        href={`/playground/bases/${base.id}/t/${table.id}/${view.id}`}
                      >
                        <ViewIcon type={view.type} class="mr-2 h-4 w-4" />
                        {view.name}
                      </a>

                      <div>
                        {#if active}
                          <DropdownMenu.Root>
                            <DropdownMenu.Trigger
                              class="flex items-center justify-center opacity-0 transition-all group-hover:opacity-100"
                            >
                              <EllipsisIcon class="text-muted-foreground h-4 w-4" />
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                              <DropdownMenu.Item class="text-xs" on:click={() => toggleModal(UPDATE_VIEW)}>
                                <PencilIcon class="mr-2 h-3 w-3" />
                                {$LL.table.view.updateName()}
                              </DropdownMenu.Item>
                              <DropdownMenu.Item class="text-xs" on:click={() => toggleModal(DUPLICATE_VIEW)}>
                                <CopyPlusIcon class="mr-2 h-3 w-3" />
                                {$LL.table.view.duplicateView()}
                              </DropdownMenu.Item>
                              {#if !view.isDefault}
                                <DropdownMenu.Item class="text-xs" on:click={() => toggleModal(SET_DEFAULT_VIEW)}>
                                  <PencilIcon class="mr-2 h-3 w-3" />
                                  {$LL.table.view.setAsDefaultView()}
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                  class="text-xs text-red-500 hover:!bg-red-200 hover:!text-red-500"
                                  on:click={() => toggleModal(DELETE_VIEW)}
                                >
                                  <CopyPlusIcon class="mr-2 h-3 w-3" />
                                  {$LL.table.view.deleteView()}
                                </DropdownMenu.Item>
                              {/if}
                            </DropdownMenu.Content>
                          </DropdownMenu.Root>
                        {/if}
                      </div>
                    </div>
                  {/each}
                </Collapsible.Content>
              </Collapsible.Root>
            {/each}
          </Collapsible.Content>
        </Collapsible.Root>
      </nav>
    </Resizable.Pane>
    <Resizable.Handle />
    <Resizable.Pane class="grid flex-1" defaultSize={RIGHT_SIZE}>
      <slot />
    </Resizable.Pane>
  </Resizable.PaneGroup>
</main>

{#await import("$lib/components/blocks/import-table/import-table-dialog.svelte") then { default: ImportTableDialog }}
  <ImportTableDialog tableNames={tables.map((t) => t.name)} />
{/await}

{#await import("$lib/components/blocks/create-table/create-table-sheet.svelte") then { default: CreateTableSheet }}
  <CreateTableSheet tableNames={tables.map((t) => t.name)} />
{/await}
