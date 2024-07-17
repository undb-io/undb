<script lang="ts">
  import { page } from "$app/stores"
  import { type GetIndexQuery$result } from "$houdini"
  import { ChevronRightIcon, DatabaseIcon, HardDriveIcon, SheetIcon, PlusIcon } from "lucide-svelte"
  import { CREATE_TABLE_MODAL, toggleModal } from "$lib/store/modal.store"
  import { baseId } from "$lib/store/base.store"
  import * as Collapsible from "$lib/components/ui/collapsible"
  import { cn } from "$lib/utils"
  import CreateViewButton from "../view/create-view-button.svelte"
  import { onMount } from "svelte"

  export let tables: GetIndexQuery$result["tables"] = []
  export let bases: GetIndexQuery$result["bases"] = []

  let el: HTMLElement
  $: tables, el?.querySelector('[data-active="true"]')?.scrollIntoView()
  $: tableId = $page.params.tableId
  $: viewId = $page.params.viewId
  $: paramBaseId = $page.params.baseId

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
  }

  $: tableId, viewId, handleActive()

  let open: Record<string, boolean> = {}
</script>

<nav bind:this={el} class="grid items-start gap-1 px-1.5 text-sm font-medium">
  {#if bases?.length}
    <ul>
      {#each bases as base}
        {#if base}
          {@const active = base.id === paramBaseId}
          {@const baseTables = tables.filter((t) => t?.baseId === base.id)}
          <Collapsible.Root bind:open={open[base.id]}>
            <div
              class={cn(
                "group flex h-8 items-center justify-between pl-4 pr-2",
                active && !tableId && !viewId ? "rounded-md bg-sky-100/80 hover:bg-sky-100" : "hover:bg-gray-100",
              )}
            >
              <a
                class={cn(
                  "flex h-full flex-1 items-center font-light",
                  active && !tableId && !viewId && "text-primary font-medium",
                )}
                href={`/bases/${base.id}`}
              >
                <HardDriveIcon class="mr-2 h-4 w-4" />
                {base.name}
              </a>

              <div
                class="itemce text-muted-foreground flex justify-center gap-2 opacity-0 transition-all group-hover:opacity-100"
              >
                <button
                  class="h-full"
                  on:click={() => {
                    baseId.set(base.id)
                    toggleModal(CREATE_TABLE_MODAL)
                  }}
                >
                  <PlusIcon class="h-4 w-4" />
                </button>
                <Collapsible.Trigger class="h-full">
                  <ChevronRightIcon
                    class={cn("text-muted-foreground h-4 w-4 transition-all", open[base.id] && "rotate-90")}
                  />
                </Collapsible.Trigger>
              </div>
            </div>
            <Collapsible.Content class="space-y-1 pt-1">
              {#each baseTables as table}
                {#if table}
                  {@const active = table.id === tableId}
                  <Collapsible.Root bind:open={open[table.id]}>
                    <div
                      class={cn(
                        "group flex h-8 cursor-pointer items-center justify-between rounded-md pl-8 pr-2",
                        active && !viewId ? "bg-sky-100/80 hover:bg-sky-100" : "hover:bg-gray-100",
                      )}
                    >
                      <a
                        href={`/t/${table.id}`}
                        class={cn("flex h-full flex-1 items-center font-light", active && "text-primary font-medium")}
                      >
                        <DatabaseIcon class="mr-1 h-4 w-4" />
                        {table.name}
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
                            active && !viewId && "hover:bg-sky-200",
                          )}
                        >
                          <ChevronRightIcon
                            class={cn("text-muted-foreground h-4 w-4 transition-all", open[table.id] && "rotate-90")}
                          />
                        </Collapsible.Trigger>
                      </div>
                    </div>
                    <Collapsible.Content>
                      <CreateViewButton tableId={table.id} variant="link" class="mt-0 h-8 p-0 pl-14 text-xs">
                        <span class="text-xs font-light">+ Create View</span>
                      </CreateViewButton>

                      {#each table.views.filter((view) => !view.isDefault) as view}
                        {@const active = view.id === viewId}
                        <div
                          class={cn(
                            "flex h-8 items-center justify-between pl-14",
                            active ? "bg-sky-100/80 hover:bg-sky-100" : "hover:bg-gray-100",
                          )}
                        >
                          <a
                            class={cn(
                              "flex h-full flex-1 items-center text-xs font-light",
                              active && "text-primary font-medium",
                            )}
                            href={`/t/${table.id}/${view.id}`}
                          >
                            <SheetIcon class="mr-1 h-4 w-4" />
                            {view.name}
                          </a>
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
