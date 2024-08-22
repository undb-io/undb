<script lang="ts">
  import { page } from "$app/stores"
  import type { IBaseOption } from "@undb/base"
  import { ChevronRightIcon, DatabaseIcon, HardDriveIcon, SheetIcon } from "lucide-svelte"
  import * as Collapsible from "$lib/components/ui/collapsible"
  import { cn } from "$lib/utils"

  export let base: {
    id: string
    name: string
    option: IBaseOption | null
    tables: ({
      id: string
      name: string
      views: {
        id: string
        isDefault: boolean | null
        name: string
      }[]
    } | null)[]
  }

  $: shareId = $page.params.shareId
  $: tableId = $page.params.tableId
  $: viewId = $page.params.viewId
  $: baseTables = base.tables.filter((t) => t !== null) ?? []

  let open: Record<string, boolean> = {}
</script>

<a href={`/s/b/${shareId}`} class={cn("group flex h-8 items-center justify-between pl-4 pr-2 transition-all")}>
  <div class={cn("flex h-full flex-1 items-center font-light")}>
    <HardDriveIcon class="mr-2 h-4 w-4" />
    {base.name}
  </div>
</a>
{#each baseTables as table}
  {#if table}
    {@const active = table.id === tableId}
    {@const views = table.views.filter((view) => !view.isDefault)}
    <Collapsible.Root bind:open={open[table.id]}>
      <div
        class={cn(
          "group flex h-8 cursor-pointer items-center justify-between rounded-md pl-8 pr-2 transition-all",
          active && !viewId ? "bg-primary/90" : "hover:bg-gray-100",
        )}
      >
        <a
          href={`/s/b/${shareId}/t/${table.id}`}
          class={cn(
            "text-primary flex h-full flex-1 items-center font-light",
            active && !viewId && "text-background font-medium",
          )}
        >
          <DatabaseIcon class="mr-2 h-4 w-4" />
          {table.name}
        </a>
        <div class="flex items-center gap-2 opacity-0 transition-all group-hover:opacity-100">
          {#if views.length > 0}
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
          {/if}
        </div>
      </div>
      <Collapsible.Content>
        {#each views as view}
          {@const active = view.id === viewId}
          <div
            class={cn(
              "group flex h-8 items-center justify-between rounded-sm pl-14 pr-2 transition-all",
              active ? "bg-primary/90" : "hover:bg-gray-100",
            )}
          >
            <a
              class={cn("flex h-full flex-1 items-center text-xs font-light", active && "text-background font-medium")}
              href={`/s/b/${shareId}/t/${table.id}/${view.id}`}
            >
              <SheetIcon class="mr-2 h-4 w-4" />
              {view.name}
            </a>
          </div>
        {/each}
      </Collapsible.Content>
    </Collapsible.Root>
  {/if}
{/each}
