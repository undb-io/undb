<script lang="ts">
  import { page } from "$app/stores"
  import { type GetIndexQuery$result } from "$houdini"
  import {
    ChevronRightIcon,
    DatabaseIcon,
    HardDriveIcon,
    GaugeIcon,
    PlusIcon,
    EllipsisIcon,
    PencilIcon,
    CopyPlusIcon,
    InboxIcon,
  } from "lucide-svelte"
  import {
    CREATE_TABLE_MODAL,
    DELETE_VIEW,
    DUPLICATE_VIEW,
    SET_DEFAULT_VIEW,
    toggleModal,
    UPDATE_VIEW,
  } from "$lib/store/modal.store"
  import CreateBaseButton from "../base/create-base-button.svelte"
  import { baseId } from "$lib/store/base.store"
  import * as Collapsible from "$lib/components/ui/collapsible"
  import { cn } from "$lib/utils"
  import CreateViewButton from "../view/create-view-button.svelte"
  import { onMount } from "svelte"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js"
  import { hasPermission } from "$lib/store/space-member.store"
  import { Skeleton } from "$lib/components/ui/skeleton"
  import ViewIcon from "../view/view-icon.svelte"
  import { LL } from "@undb/i18n/client"

  export let tables: GetIndexQuery$result["tables"] = []
  export let bases: GetIndexQuery$result["bases"] = []
  export let dashboards: GetIndexQuery$result["dashboards"] = []
  export let isLoading: boolean = false

  let el: HTMLElement
  $: tables, el?.querySelector('[data-active="true"]')?.scrollIntoView()
  $: tableId = $page.params.tableId
  $: viewId = $page.params.viewId
  $: paramBaseId = $page.params.baseId
  $: dashboardId = $page.params.dashboardId

  onMount(() => {
    if (paramBaseId) {
      open[paramBaseId] = true
    }
  })

  const handleActive = () => {
    const activeTable = tables.find((t) => t?.id === tableId)

    if (activeTable) {
      open[activeTable.baseId] = true

      const activeView = activeTable?.views.find((v) => v?.id === viewId)
      if (activeView) {
        open[activeTable.id] = true
      }
    }

    const activeDashboard = dashboards.find((d) => d?.id === dashboardId)
    if (activeDashboard) {
      open[activeDashboard.baseId] = true
    }
  }

  $: tableId, viewId, tables, handleActive()
  $: if (paramBaseId) {
    open[paramBaseId] = true
  }

  let open: Record<string, boolean> = {}
</script>

<nav bind:this={el} class="items-start gap-1 px-1.5 text-sm font-medium">
  {#if bases?.length}
    <ul>
      {#each bases as base}
        {#if base}
          {@const active = base.id === paramBaseId}
          {@const baseTables = tables.filter((t) => t?.baseId === base.id)}
          {@const baseDashboards = dashboards.filter((d) => d?.baseId === base.id)}
          <Collapsible.Root bind:open={open[base.id]}>
            <div
              class={cn(
                "group flex h-8 items-center justify-between gap-1 overflow-hidden pl-4 pr-2 transition-all",
                active && !tableId && !viewId ? "text-background rounded-md bg-gray-800/90" : "hover:bg-gray-100",
              )}
            >
              <a
                class={cn(
                  "flex h-full flex-1 items-center overflow-hidden font-normal text-gray-600",
                  active && !tableId && !viewId && "text-background font-medium",
                )}
                href={`/bases/${base.id}`}
              >
                <HardDriveIcon class="mr-2 h-4 w-4" />
                <span class="truncate">
                  {base.name}
                </span>
              </a>

              <div
                class={cn(
                  "item-center text-muted-foreground flex justify-center gap-2 opacity-0 transition-all group-hover:opacity-100",
                  active && "text-background",
                )}
              >
                {#if $hasPermission("table:create")}
                  <button
                    class="h-full"
                    on:click={() => {
                      baseId.set(base.id)
                      toggleModal(CREATE_TABLE_MODAL)
                    }}
                  >
                    <PlusIcon class="h-4 w-4" />
                  </button>
                {/if}
                <Collapsible.Trigger class="h-full">
                  <ChevronRightIcon
                    class={cn(
                      "text-muted-foreground h-4 w-4 transition-all",
                      open[base.id] && "rotate-90",
                      active && "text-background",
                    )}
                  />
                </Collapsible.Trigger>
              </div>
            </div>
            <Collapsible.Content class="space-y-1 pt-1">
              {#each baseDashboards as dashboard}
                {#if dashboard}
                  {@const active = dashboard.id === dashboardId}
                  <div
                    class={cn(
                      "group flex h-8 cursor-pointer items-center justify-between gap-1 truncate rounded-md pl-8 pr-2 transition-all",
                      active ? "bg-gray-800/90" : "hover:bg-gray-100",
                    )}
                  >
                    <a
                      href={`/dashboards/${dashboard.id}`}
                      class={cn(
                        "flex h-full flex-1 items-center overflow-hidden font-normal text-gray-600",
                        active && "text-background font-medium",
                      )}
                    >
                      <GaugeIcon class="mr-2 h-4 w-4" />
                      {dashboard.name}
                    </a>
                  </div>
                {/if}
              {/each}
              {#each baseTables as table}
                {#if table}
                  {@const active = table.id === tableId}
                  <Collapsible.Root bind:open={open[table.id]}>
                    <div
                      class={cn(
                        "group flex h-8 cursor-pointer items-center justify-between gap-1 truncate rounded-md pl-8 pr-2 transition-all",
                        active && !viewId ? "bg-gray-800/90" : "hover:bg-gray-100",
                      )}
                    >
                      <a
                        href={`/t/${table.id}`}
                        title={table.name}
                        class={cn(
                          "flex h-full flex-1 items-center overflow-hidden font-normal text-gray-600",
                          active && !viewId && "text-background font-medium",
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
                            href={`/t/${table.id}/${view.id}`}
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
                {/if}
              {/each}
            </Collapsible.Content>
          </Collapsible.Root>
        {/if}
      {/each}
    </ul>
  {:else if isLoading}
    <div class="space-y-2">
      <Skeleton class="h-8 w-full" />
      <Skeleton class="h-8 w-full" />
      <Skeleton class="h-8 w-full" />
      <Skeleton class="h-8 w-full" />
      <Skeleton class="h-8 w-full" />
      <Skeleton class="h-8 w-full" />
      <Skeleton class="h-8 w-full" />
      <Skeleton class="h-8 w-full" />
      <Skeleton class="h-8 w-full" />
      <Skeleton class="h-8 w-full" />
      <Skeleton class="h-8 w-full" />
    </div>
  {:else}
    <div class="flex flex-col items-center space-y-4 pt-12">
      <InboxIcon class="text-muted-foreground h-16 w-16" />
      <p class="text-muted-foreground">{$LL.base.noBases()}</p>
      <CreateBaseButton variant="outline" />
    </div>
  {/if}
</nav>
