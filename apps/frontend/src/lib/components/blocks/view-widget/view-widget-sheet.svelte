<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet"
  import { Button } from "$lib/components/ui/button"
  import * as Popover from "$lib/components/ui/popover"
  import { isModalOpen, VIEW_WIDGET_MODAL, toggleModal } from "$lib/store/modal.store"
  import { getTable } from "$lib/store/table.store"
  import { derived, type Readable } from "svelte/store"
  import { PlusIcon } from "lucide-svelte"
  import { createMutation } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import CreateWidgetForm from "../widget/create-widget-form.svelte"
  import Widget from "../widget/widget.svelte"

  let table = getTable()
  export let viewId: Readable<string | undefined>

  let view = derived([table, viewId], ([$table, $viewId]) => $table?.views.getViewById($viewId))
  let widgets = derived([view], ([$view]) => ($view?.widgets.unwrapOr([]) ?? []).map((w) => w.toJSON()))

  const createViewWidgetMutation = createMutation({
    mutationFn: trpc.table.view.widget.create.mutate,
  })

  let open = false
</script>

<Sheet.Root open={$isModalOpen(VIEW_WIDGET_MODAL)} onOpenChange={() => toggleModal(VIEW_WIDGET_MODAL)}>
  <Sheet.Content side="right" class="flex flex-col">
    <Sheet.Header>
      <Sheet.Title>Widgets</Sheet.Title>
      <Sheet.Description>View Widgets</Sheet.Description>
    </Sheet.Header>
    <div class="flex-1 space-y-3 overflow-y-auto">
      {#each $widgets as widget}
        <Widget {widget} viewId={$view.id.value} />
      {/each}
      <Popover.Root bind:open>
        <Popover.Trigger asChild let:builder>
          <Button size="sm" class="w-full" builders={[builder]} variant={$widgets.length ? "outline" : "default"}>
            <PlusIcon class="mr-2 size-4" />
            Add Widget
          </Button>
        </Popover.Trigger>
        <Popover.Content sameWidth>
          {#if $viewId}
            <CreateWidgetForm
              viewId={$viewId}
              onSuccess={() => {
                open = false
              }}
            />
          {/if}
        </Popover.Content>
      </Popover.Root>
    </div>
    <Sheet.Footer>
      <Sheet.Close asChild let:builder>
        <Button disabled={$createViewWidgetMutation.isPending} builders={[builder]} type="button">Close</Button>
      </Sheet.Close>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
