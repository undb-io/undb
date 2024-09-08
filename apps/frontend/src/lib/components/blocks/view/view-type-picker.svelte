<script lang="ts">
  import Check from "svelte-radix/Check.svelte"
  import CaretSort from "svelte-radix/CaretSort.svelte"
  import { tick } from "svelte"
  import * as Command from "$lib/components/ui/command/index.js"
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import { cn } from "$lib/utils.js"
  import ViewIcon from "./view-icon.svelte"
  import { viewTypes, type ViewType } from "@undb/table"
  import { LL } from "@undb/i18n/client"

  let open = false
  export let value: ViewType | undefined = undefined
  export let onValueChange: (value: ViewType) => void = () => {}

  let search = ""

  $: filtered =
    viewTypes.filter((v) => {
      const label = $LL.table.viewTypes[v]()
      return label.toLowerCase().includes(search.toLowerCase())
    }) ?? []

  $: selected = viewTypes.find((v) => v === value)
  $: selectedValue = selected ?? "select a view type..."

  function closeAndFocusTrigger(triggerId: string) {
    open = false
    tick().then(() => {
      document.getElementById(triggerId)?.focus()
    })
  }

  export let sameWidth = true
</script>

<Popover.Root bind:open let:ids portal="body">
  <Popover.Trigger asChild let:builder>
    <Button
      size="sm"
      builders={[builder]}
      variant="outline"
      role="combobox"
      aria-expanded={open}
      {...$$restProps}
      class={cn("w-full justify-between", $$restProps.class)}
    >
      <span class="flex items-center overflow-hidden text-ellipsis" title={selectedValue}>
        {#if selected}
          <ViewIcon type={selected} class="mr-2 h-3 w-3" />
          <slot>
            {$LL.table.viewTypes[selected]()}
          </slot>
        {/if}
      </span>
      <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </Popover.Trigger>
  <Popover.Content class="p-0" {sameWidth}>
    <Command.Root shouldFilter={false}>
      <Command.Input bind:value={search} placeholder="Search view type..." class="h-9" />
      <Command.Empty>No view type found</Command.Empty>
      <Command.Group class="max-h-[300px] overflow-y-auto">
        {#each filtered as type}
          <Command.Item
            value={type}
            onSelect={(currentValue) => {
              value = currentValue
              if (value) {
                onValueChange(value)
              }
              closeAndFocusTrigger(ids.trigger)
            }}
          >
            <Check class={cn("mr-2 h-4 w-4", value !== type && "text-transparent")} />
            <div class="flex items-center gap-2">
              <ViewIcon {type} class="h-3 w-3" />
              <span class="text-xs">
                {$LL.table.viewTypes[type]()}
              </span>
            </div>
          </Command.Item>
        {/each}
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
