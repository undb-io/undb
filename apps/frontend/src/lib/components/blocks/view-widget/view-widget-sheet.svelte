<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet"
  import { Button } from "$lib/components/ui/button"
  import * as Popover from "$lib/components/ui/popover"
  import { isModalOpen, VIEW_WIDGET_MODAL, toggleModal } from "$lib/store/modal.store"
  import { getTable } from "$lib/store/table.store"
  import { derived, type Readable } from "svelte/store"
  import { PlusIcon } from "lucide-svelte"
  import CreateViewWidgetForm from "../widget/create-view-widget-form.svelte"
  import Widget from "../widget/widget.svelte"
  import { onMount } from "svelte"
  import { LL } from "@undb/i18n/client"

  let table = getTable()
  export let viewId: Readable<string | undefined>
  export let shareId: string | undefined = undefined
  export let readonly = false

  let view = derived([table, viewId], ([$table, $viewId]) => $table?.views.getViewById($viewId))
  let widgets = derived([view], ([$view]) => ($view?.widgets.unwrapOr([]) ?? []).map((w) => w.toJSON()))

  let open = false

  onMount(() => {
    // if (widgetsContainer) {
    //   new Sortable(widgetsContainer, {
    //     animation: 150,
    //     ghostClass: "bg-gray-100",
    //     onEnd: (evt) => {
    //       // 在这里处理排序结果
    //       const newOrder = Array.from(widgetsContainer.children).map((el) => el.id)
    //       // 调用API更新widget顺序
    //       updateWidgetsOrder(newOrder)
    //     },
    //   })
    // }
  })

  function updateWidgetsOrder(newOrder: string[]) {
    // 调用API更新widget顺序的逻g辑
    // 例如:
    // trpc.table.view.widget.updateOrder.mutate({
    //   viewId: $viewId,
    //   order: newOrder
    // })
  }
</script>

<Sheet.Root portal="body" open={$isModalOpen(VIEW_WIDGET_MODAL)} onOpenChange={() => toggleModal(VIEW_WIDGET_MODAL)}>
  <Sheet.Content side="right" class="flex flex-col">
    <Sheet.Header>
      <Sheet.Title>{$LL.widget.title()}</Sheet.Title>
      <Sheet.Description>{$LL.table.view.widget.title()}</Sheet.Description>
    </Sheet.Header>
    {#if $widgets.length}
      <div class="flex-1 space-y-3 overflow-y-auto" bind:this={widgetsContainer}>
        {#each $widgets as widget}
          <Widget
            table={$table}
            {shareId}
            {widget}
            viewId={$view.id.value}
            tableId={$table.id.value}
            class="h-[180px]"
          />
        {/each}
      </div>
    {:else}
      <div class="flex flex-1 items-center justify-center">
        <p class="text-muted-foreground text-sm">{$LL.table.view.widget.empty()}</p>
      </div>
    {/if}
    {#if !shareId && !readonly}
      <Popover.Root bind:open>
        <Popover.Trigger asChild let:builder>
          <Button size="sm" class="w-full" builders={[builder]} variant={$widgets.length ? "outline" : "default"}>
            <PlusIcon class="mr-2 size-4" />
            {$LL.table.view.widget.add()}
          </Button>
        </Popover.Trigger>
        <Popover.Content sameWidth>
          {#if $viewId}
            <CreateViewWidgetForm
              viewId={$viewId}
              onSuccess={() => {
                open = false
              }}
            />
          {/if}
        </Popover.Content>
      </Popover.Root>
    {/if}
  </Sheet.Content>
</Sheet.Root>
