<script lang="ts">
  import type { IWidgetDTO } from "@undb/table"
  import { EllipsisIcon, PencilIcon, Maximize2Icon } from "lucide-svelte"
  import Aggregate from "../aggregate/aggregate.svelte"
  import AggregateConfig from "../aggregate/config/aggregate-config.svelte"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import * as Dialog from "$lib/components/ui/dialog"
  import { Input } from "$lib/components/ui/input"
  import { Button } from "$lib/components/ui/button"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { TrashIcon } from "lucide-svelte"
  import { getTable } from "$lib/store/table.store"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import { invalidate } from "$app/navigation"
  import { toast } from "svelte-sonner"
  import { getDashboard, getIsDashboard } from "$lib/store/dashboard.store"
  import { cn } from "$lib/utils"
  import { GripVerticalIcon, ChevronRightIcon } from "lucide-svelte"

  export let tableId: string | undefined
  const table = getTable()

  export let widget: IWidgetDTO
  export let viewId: string | undefined = undefined
  export let ignoreView: boolean = false
  export let shareId: string | undefined = undefined

  export let movePointerDown: ((e: Event) => void) | undefined = undefined
  export let resizePointerDown: ((e: Event) => void) | undefined = undefined

  const isDashboard = getIsDashboard()
  const dashboard = getDashboard()

  let editing = false
  let open = false
  let confirmDelete = false

  const deleteViewWidgetMutation = createMutation({
    mutationFn: trpc.table.view.widget.delete.mutate,
    onSuccess: async () => {
      confirmDelete = false
      if ($table) {
        await invalidate(`table:${tableId}`)
      }
    },
    onError(error, variables, context) {
      toast.error(error.message)
    },
  })

  const deleteDashboardWidgetMutation = createMutation({
    mutationFn: trpc.dashboard.widget.delete.mutate,
    onSuccess: async () => {
      confirmDelete = false
      if ($isDashboard) {
        await invalidate(`dashboard:${$dashboard.id.value}`)
      }
    },
    onError(error, variables, context) {
      toast.error(error.message)
    },
  })
</script>

<div class={cn("group absolute flex h-full w-full flex-col rounded-sm border", $$restProps.class)}>
  <div class="flex items-center justify-between p-2">
    <div class="flex items-center gap-0.5">
      {#if movePointerDown}
        <button on:pointerdown={movePointerDown}>
          <GripVerticalIcon
            class="text-muted-foreground size-4 cursor-grab opacity-0 group-hover:block group-hover:opacity-100 dark:text-gray-200"
          />
        </button>
      {/if}
      <span class="text-sm font-bold">{widget.name}</span>
    </div>
    {#if !shareId}
      <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100">
        <Dialog.Root bind:open portal="body">
          <Dialog.Trigger>
            <Maximize2Icon class="size-3" />
          </Dialog.Trigger>
          <Dialog.Content class="sm:max-w-4/5 max-w-4/5 flex h-[calc(100vh-200px)] !w-4/5 flex-col gap-0 p-0">
            <Dialog.Header class="border-b p-4" on:dblclick={() => (editing = true)}>
              <Dialog.Title>
                {#if editing}
                  <Input
                    on:blur={() => {
                      editing = false
                    }}
                    class="w-1/2"
                    autofocus
                    on:focus={(e) => e.target.select()}
                    bind:value={widget.name}
                  />
                {:else}
                  {widget.name}
                {/if}
              </Dialog.Title>
            </Dialog.Header>

            <div class="flex h-full flex-1">
              <div class="w-3/4 pr-4">
                {#if widget.item.type === "aggregate"}
                  <Aggregate
                    {tableId}
                    {widget}
                    {viewId}
                    {shareId}
                    {ignoreView}
                    aggregate={widget.item.aggregate}
                    class="h-full text-[6rem]"
                  />
                {/if}
              </div>
              <div class="flex w-1/4 flex-col border-l px-4 py-2">
                <div class="flex-1">
                  {#if widget.item.type === "aggregate"}
                    <AggregateConfig
                      {tableId}
                      {viewId}
                      {widget}
                      aggregate={widget.item.aggregate}
                      onSuccess={() => {
                        editing = false
                      }}
                    />
                  {/if}
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Root>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <EllipsisIcon class="size-3" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item
              class="text-xs"
              on:click={() => {
                open = true
                editing = true
              }}
            >
              <PencilIcon class="mr-2 size-3" />
              Edit Name
            </DropdownMenu.Item>
            <DropdownMenu.Item class="text-xs" on:click={() => (confirmDelete = true)}>
              <TrashIcon class="mr-2 size-3" />
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    {/if}
  </div>
  {#if widget.item.type === "aggregate"}
    <Aggregate {tableId} {ignoreView} {widget} {viewId} {shareId} aggregate={widget.item.aggregate} />
  {/if}

  {#if resizePointerDown}
    <button on:pointerdown={resizePointerDown}>
      <ChevronRightIcon
        class="text-muted-foreground absolute bottom-0 right-0
				hidden size-4 rotate-45 cursor-se-resize
				text-3xl group-hover:block"
      />
    </button>
  {/if}
</div>

<AlertDialog.Root bind:open={confirmDelete}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Delete Widget {widget.name}?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete this widget. and remove your data from our servers.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action asChild let:builder>
        <Button
          builders={[builder]}
          variant="destructive"
          on:click={() => {
            if ($isDashboard) {
              $deleteDashboardWidgetMutation.mutate({ dashboardId: $dashboard.id.value, widgetId: widget.id })
            } else if (viewId && tableId) {
              $deleteViewWidgetMutation.mutate({ tableId, viewId, id: widget.id })
            }
          }}
        >
          Delete
        </Button>
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
