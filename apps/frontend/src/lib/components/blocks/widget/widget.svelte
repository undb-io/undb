<script lang="ts">
  import type { IWidgetDTO, TableDo } from "@undb/table"
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
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import { invalidate } from "$app/navigation"
  import { toast } from "svelte-sonner"
  import { getDashboard, getDashboardWidgetItemsStore, getIsDashboard } from "$lib/store/dashboard.store"
  import { cn } from "$lib/utils"
  import { GripVerticalIcon, ChevronRightIcon, CopyIcon } from "lucide-svelte"
  import { COLS, DashboardLayouts } from "@undb/dashboard"
  import { LL } from "@undb/i18n/client"

  export let tableId: string | undefined
  export let table: TableDo | undefined

  export let widget: IWidgetDTO
  export let viewId: string | undefined = undefined
  export let ignoreView: boolean = false
  export let shareId: string | undefined = undefined
  export let readonly = false

  export let movePointerDown: ((e: Event) => void) | undefined = undefined
  export let resizePointerDown: ((e: Event) => void) | undefined = undefined

  const isDashboard = getIsDashboard()
  const dashboard = getDashboard()

  let editing = false
  let open = false
  let confirmDelete = false

  const deleteViewWidgetMutation = createMutation({
    mutationFn: trpc.table.view.widget.delete.mutate,
    enabled: !shareId,
    onSuccess: async () => {
      confirmDelete = false
      if (table) {
        await invalidate(`undb:table:${tableId}`)
      }
    },
    onError(error, variables, context) {
      toast.error(error.message)
    },
  })

  const deleteDashboardWidgetMutation = createMutation({
    mutationFn: trpc.dashboard.widget.delete.mutate,
    enabled: !shareId,
    onSuccess: async () => {
      confirmDelete = false
      if ($isDashboard) {
        await invalidate(`undb:dashboard:${$dashboard.id.value}`)
      }
    },
    onError(error, variables, context) {
      toast.error(error.message)
    },
  })

  const dashboardWidgets = getDashboardWidgetItemsStore()

  let confirmDuplicate = false
  const duplicateDashboardWidgetMutation = createMutation({
    mutationFn: trpc.dashboard.widget.duplicate.mutate,
    enabled: !shareId,
    onSuccess: async () => {
      if ($isDashboard) {
        await invalidate(`undb:dashboard:${$dashboard.id.value}`)
      }
    },
    onError(error, variables, context) {
      toast.error(error.message)
    },
  })

  const duplicateViewWidgetMutation = createMutation({
    mutationFn: trpc.table.view.widget.duplicate.mutate,
    enabled: !shareId,
    onSuccess: async () => {
      confirmDuplicate = false
      if (table) {
        await invalidate(`undb:table:${tableId}`)
      }
    },
    onError(error, variables, context) {
      toast.error(error.message)
    },
  })
</script>

<div class={cn("group flex h-full w-full flex-col rounded-sm border", $$restProps.class)}>
  <div class="flex items-center justify-between p-2">
    <div class="flex items-center gap-0.5">
      {#if movePointerDown && !shareId && !readonly}
        <button on:pointerdown={movePointerDown}>
          <GripVerticalIcon
            class="text-muted-foreground size-4 cursor-grab opacity-0 group-hover:block group-hover:opacity-100 dark:text-gray-200"
          />
        </button>
      {/if}
      <span class="text-sm font-bold">{widget.name}</span>
    </div>
    {#if !shareId && !readonly}
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
                {#if widget.item.type === "aggregate" && table}
                  <Aggregate
                    {table}
                    {tableId}
                    {widget}
                    {viewId}
                    {shareId}
                    {ignoreView}
                    {readonly}
                    aggregate={widget.item.aggregate}
                    class="h-full text-[6rem]"
                  />
                {/if}
              </div>
              <div class="flex w-1/4 flex-col border-l px-4 py-2">
                <div class="flex-1">
                  {#if widget.item.type === "aggregate" && table}
                    <AggregateConfig
                      {table}
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

        {#if !readonly}
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
                {$LL.widget.editName()}
              </DropdownMenu.Item>
              <DropdownMenu.Item class="text-xs" on:click={() => (confirmDuplicate = true)}>
                <CopyIcon class="mr-2 size-3" />
                {$LL.widget.duplicate({ name: widget.name })}
              </DropdownMenu.Item>
              <DropdownMenu.Item class="text-xs" on:click={() => (confirmDelete = true)}>
                <TrashIcon class="mr-2 size-3" />
                {$LL.widget.delete({ name: widget.name })}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        {/if}
      </div>
    {/if}
  </div>
  {#if widget.item.type === "aggregate" && table}
    <Aggregate {table} {tableId} {ignoreView} {widget} {viewId} {shareId} aggregate={widget.item.aggregate} />
  {/if}

  {#if resizePointerDown && !shareId && !readonly}
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
      <AlertDialog.Title>{$LL.widget.deleteConfirm.title({ name: widget.name })}</AlertDialog.Title>
      <AlertDialog.Description>
        {$LL.widget.deleteConfirm.description()}
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

<AlertDialog.Root bind:open={confirmDuplicate}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>{$LL.widget.duplicate({ name: widget.name })}</AlertDialog.Title>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>{$LL.common.cancel()}</AlertDialog.Cancel>
      <AlertDialog.Action asChild>
        <Button
          on:click={() => {
            if ($isDashboard) {
              const added = dashboardWidgets.add(widget.item.type)
              const layout = added[COLS]
              const defaultLayout = DashboardLayouts.default()
              $duplicateDashboardWidgetMutation.mutate({
                dashboardId: $dashboard.id.value,
                widgetId: widget.id,
                layout: {
                  x: layout.x ?? defaultLayout.x,
                  y: layout.y ?? defaultLayout.y,
                  w: layout.w ?? defaultLayout.w,
                  h: layout.h ?? defaultLayout.h,
                },
              })
            } else if (viewId && tableId) {
              $duplicateViewWidgetMutation.mutate({ tableId, viewId, widgetId: widget.id })
            }
          }}
        >
          {$LL.common.confirm()}
        </Button>
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
