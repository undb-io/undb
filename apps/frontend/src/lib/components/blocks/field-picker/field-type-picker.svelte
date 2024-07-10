<script lang="ts">
  import Check from "svelte-radix/Check.svelte"
  import CaretSort from "svelte-radix/CaretSort.svelte"
  import { tick } from "svelte"
  import * as Command from "$lib/components/ui/command/index.js"
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import { cn } from "$lib/utils.js"
  import FieldIcon from "../field-icon/field-icon.svelte"
  import { allFieldTypes, fieldTypes, type FieldType } from "@undb/table"

  let open = false
  export let value: FieldType | undefined = undefined
  export let onValueChange: (value: FieldType) => void = () => {}

  $: selected = allFieldTypes.find((f) => f === value)
  $: selectedValue = selected ?? "Select a field type..."

  function closeAndFocusTrigger(triggerId: string) {
    open = false
    tick().then(() => {
      document.getElementById(triggerId)?.focus()
    })
  }
</script>

<Popover.Root bind:open let:ids>
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
          <FieldIcon type={selected} class="mr-2 h-3 w-3" />
        {/if}
      </span>
      <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0">
    <Command.Root
      filter={(value, search) => {
        const label = fieldTypes.find((f) => f === value) ?? ""
        return label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
      }}
    >
      <Command.Input placeholder="Search field..." class="h-9" />
      <Command.Empty>No field found.</Command.Empty>
      <Command.Group>
        {#each fieldTypes as type}
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
              <FieldIcon {type} class="h-4 w-4" />
              <span>
                {type}
              </span>
            </div>
          </Command.Item>
        {/each}
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
