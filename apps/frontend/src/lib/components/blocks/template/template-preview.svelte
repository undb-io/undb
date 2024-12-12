<script lang="ts">
  import { type ITemplateDTO } from "@undb/template"
  import { writable } from "svelte/store"
  import { derived } from "svelte/store"
  import { setTable } from "$lib/store/table.store"
  import { cn } from "$lib/utils"
  import { HardDriveIcon, DatabaseIcon, ViewIcon, ChevronRightIcon } from "lucide-svelte"
  import * as Collapsible from "$lib/components/ui/collapsible"
  import { setTemplate } from "$lib/store/template.store.svelte"
  import RecordDetailSheet from "$lib/components/blocks/record-detail/record-detail-sheet.svelte"
  import View from "$lib/components/blocks/view/view.svelte"
  import { onMount } from "svelte"
  import { getDataService, setIsLocal } from "$lib/store/data-service.store"
  import { createQuery } from "@tanstack/svelte-query"
  import { preferences } from "$lib/store/persisted.store"
  import { RecordDO } from "@undb/table"
  import { templateStore } from "$lib/store/template.store.svelte"
  import { setDashboard } from "$lib/store/dashboard.store"
  import DashboardWidgets from "$lib/components/blocks/dashboard/dashboard-widgets.svelte"

  export let template: ITemplateDTO

  setTemplate(writable(template))
  setIsLocal(true)

  let t = templateStore.mustGetTemplate(template)
  let tables = t.flatMap((base) => base.tables.map(({ table }) => table))
  let dashboards = t.flatMap((base) => base.dashboards)
  let bases = t.map((base) => base.base)

  let currentTableId = writable<string | undefined>(dashboards.length ? undefined : tables.at(0)?.id.value)
  let currentViewId = writable<string | undefined>(undefined)
  let currentDashboardId = writable<string | undefined>(dashboards.length ? dashboards.at(0)?.id.value : undefined)
  let currentTable = derived(currentTableId, ($currentTableId) => {
    return tables.find((table) => table.id.value === $currentTableId)
  })
  let currentDashboard = derived(currentDashboardId, ($currentDashboardId) => {
    return dashboards.find((dashboard) => dashboard.id.value === $currentDashboardId)
  })

  let r = writable<string | null>(null)

  let dataService = getDataService()

  const record = createQuery(
    derived([currentTable, r, preferences], ([$table, $recordId, $preferences]) => ({
      queryKey: [$recordId, "get", $preferences.showHiddenFields],
      enabled: !!$table && !!$recordId,
      queryFn: async () => {
        return dataService.records.getRecordById({
          tableId: $table?.id.value,
          id: $recordId!,
          ignoreView: $preferences.showHiddenFields,
        })
      },
    })),
  )

  $: recordDo = $record.data?.record ? RecordDO.fromJSON($currentTable!, $record.data?.record) : undefined

  $: if ($currentTable) {
    setTable(writable($currentTable))
  }

  $: if ($currentDashboard) {
    setDashboard(writable($currentDashboard))
  }

  let open: Record<string, boolean> =
    tables.length > 0
      ? {
          [tables.at(0)!.baseId]: true,
          [tables.at(0)!.id.value]: true,
        }
      : {}

  let saved = false
  onMount(async () => {
    if (templateStore.isTemplateSaved(template.id)) {
      saved = true
      return
    }

    await dataService.template.save(t, true)
    templateStore.saveTemplate(template.id, t)
    saved = true
  })
</script>

{#if template.template.type === "base" && saved}
  <div class="flex h-full overflow-auto">
    <div class="f-full w-[350px] border-r px-4 py-2">
      <nav class="items-start gap-1 px-1.5 text-sm font-medium">
        {#if bases?.length}
          <ul>
            {#each bases as base}
              {#if base}
                {@const active = base.id.value === $currentTable?.baseId && !$currentTableId && !$currentViewId}
                {@const baseTables = tables.filter((t) => t?.baseId === base.id.value)}
                {@const baseDashboards = dashboards.filter((d) => d.baseId === base.id.value)}
                <Collapsible.Root bind:open={open[base.id.value]}>
                  <div
                    class={cn(
                      "group flex h-8 items-center justify-between gap-1 overflow-hidden pl-4 pr-2 transition-all",
                      active ? "text-background rounded-md bg-gray-800/90" : "hover:bg-gray-100",
                    )}
                  >
                    <button
                      class={cn(
                        "flex h-full flex-1 items-center overflow-hidden font-normal text-gray-600",
                        active && "text-background font-medium",
                      )}
                    >
                      <HardDriveIcon class="mr-2 h-4 w-4" />
                      <span class="truncate">
                        {base.name.value}
                      </span>
                    </button>

                    <div
                      class={cn(
                        "item-center text-muted-foreground flex justify-center gap-2 opacity-0 transition-all group-hover:opacity-100",
                        active && "text-background",
                      )}
                    >
                      <Collapsible.Trigger class="h-full">
                        <ChevronRightIcon
                          class={cn(
                            "text-muted-foreground h-4 w-4 transition-all",
                            open[base.id.value] && "rotate-90",
                            active && "text-background",
                          )}
                        />
                      </Collapsible.Trigger>
                    </div>
                  </div>
                  <Collapsible.Content class="space-y-1 pt-1">
                    {#each baseDashboards as dashboard}
                      {@const active = dashboard.id.value === $currentDashboardId}
                      <div
                        class={cn(
                          "group flex h-8 cursor-pointer items-center justify-between gap-1 truncate rounded-md pl-8 pr-2 transition-all",
                          active ? "bg-gray-800/90" : "hover:bg-gray-100",
                        )}
                      >
                        <button
                          on:click={() => {
                            $currentTableId = undefined
                            $currentViewId = undefined
                            $currentDashboardId = dashboard.id.value
                          }}
                          title={dashboard.name.value}
                          class={cn(
                            "flex h-full flex-1 items-center overflow-hidden font-normal text-gray-600",
                            active && "text-background font-medium",
                          )}
                        >
                          <DatabaseIcon class="mr-2 h-4 w-4" />
                          <span class="truncate">
                            {dashboard.name.value}
                          </span>
                        </button>
                      </div>
                    {/each}
                    {#each baseTables as table}
                      {#if table}
                        {@const active = table.id.value === $currentTableId && !$currentViewId}
                        {@const views = table.views.views.filter((view) => !view.isDefault)}
                        <Collapsible.Root bind:open={open[table.id.value]}>
                          <div
                            class={cn(
                              "group flex h-8 cursor-pointer items-center justify-between gap-1 truncate rounded-md pl-8 pr-2 transition-all",
                              active ? "bg-gray-800/90" : "hover:bg-gray-100",
                            )}
                          >
                            <button
                              on:click={() => {
                                $currentTableId = table.id.value
                                $currentDashboardId = undefined
                                $currentViewId = undefined
                              }}
                              title={table.name.value}
                              class={cn(
                                "flex h-full flex-1 items-center overflow-hidden font-normal text-gray-600",
                                active && "text-background font-medium",
                              )}
                            >
                              <DatabaseIcon class="mr-2 h-4 w-4" />
                              <span class="truncate">
                                {table.name.value}
                              </span>
                            </button>
                            <div class="flex items-center gap-2 opacity-0 transition-all group-hover:opacity-100">
                              {#if views.length > 0}
                                <Collapsible.Trigger
                                  on:click={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    open[table.id.value] = !open[table.id.value]
                                  }}
                                  class={cn(
                                    "flex h-5 w-5 items-center justify-center rounded-md hover:bg-gray-200",
                                    active && "hover:bg-primary",
                                  )}
                                >
                                  <ChevronRightIcon
                                    class={cn(
                                      "text-muted-foreground h-4 w-4 transition-all",
                                      open[table.id.value] && "rotate-90",
                                      active && "text-background",
                                    )}
                                  />
                                </Collapsible.Trigger>
                              {/if}
                            </div>
                          </div>
                          <Collapsible.Content>
                            {#each views as view}
                              {@const active = view.id.value === $currentViewId}
                              <div
                                class={cn(
                                  "group flex h-8 items-center justify-between gap-1 rounded-sm pl-14 pr-2 transition-all",
                                  active ? "bg-gray-800/90" : "hover:bg-gray-100",
                                )}
                              >
                                <button
                                  class={cn(
                                    "flex h-full flex-1 items-center text-xs font-normal",
                                    active && "text-background font-medium",
                                  )}
                                  on:click={() => {
                                    $currentTableId = table.id.value
                                    $currentViewId = view.id.value
                                    $currentDashboardId = undefined
                                  }}
                                >
                                  <ViewIcon type={view.type} class="mr-2 h-4 w-4" />
                                  {view.name.value}
                                </button>
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
        {/if}
      </nav>
    </div>
    {#key $currentTableId}
      {#if $currentTable}
        <section class="flex h-full flex-1 flex-col overflow-auto">
          <View viewId={currentViewId} shareId={undefined} {r} readonly={true} />
        </section>
      {/if}
    {/key}
    {#key $currentDashboardId}
      {#if $currentDashboard}
        <DashboardWidgets readonly />
      {/if}
    {/key}
  </div>
{/if}

{#key $currentTableId}
  <RecordDetailSheet viewId={currentViewId} readonly {recordDo} isLoading={false} {r} />
{/key}
