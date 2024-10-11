<script lang="ts">
  import type { IWidgetDTO } from "@undb/table"
  import { EllipsisIcon, PencilIcon, Maximize2Icon } from "lucide-svelte"
  import Aggregate from "../aggregate/aggregate.svelte"
  import AggregateConfig from "../aggregate/config/aggregate-config.svelte"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import * as Dialog from "$lib/components/ui/dialog"

  export let widget: IWidgetDTO
</script>

<div class="rounded-sm border">
  <div class="flex items-center justify-between p-4">
    <span class="text-sm font-bold">{widget.name}</span>
    <div class="flex items-center gap-2">
      <Dialog.Root portal="body">
        <Dialog.Trigger>
          <Maximize2Icon class="size-3" />
        </Dialog.Trigger>
        <Dialog.Content class="sm:max-w-1/2 max-w-1/2 z-[200] flex h-[calc(100vh-200px)] !w-1/2 flex-col gap-0 p-0">
          <Dialog.Header class="border-b p-4">
            <Dialog.Title>{widget.name}</Dialog.Title>
          </Dialog.Header>

          <div class="flex h-full flex-1">
            <div class="w-3/4 pr-4">
              {#if widget.item.type === "aggregate"}
                <Aggregate aggregate={widget.item.aggregate} class="h-full" />
              {/if}
            </div>
            <div class="w-1/4 border-l px-4 py-2">
              {#if widget.item.type === "aggregate"}
                <AggregateConfig aggregate={widget.item.aggregate} />
              {/if}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <EllipsisIcon class="size-3" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item class="text-xs">
            <PencilIcon class="mr-2" />
            Edit Name
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  </div>
  {#if widget.item.type === "aggregate"}
    <Aggregate aggregate={widget.item.aggregate} {...$$restProps} />
  {/if}
</div>
