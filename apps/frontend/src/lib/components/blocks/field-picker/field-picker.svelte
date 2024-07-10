<script lang="ts">
  import Check from "svelte-radix/Check.svelte"
  import CaretSort from "svelte-radix/CaretSort.svelte"
  import { tick } from "svelte"
  import * as Command from "$lib/components/ui/command/index.js"
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import { cn } from "$lib/utils.js"
  import { getTable } from "$lib/store/table.store"
  import FieldIcon from "../field-icon/field-icon.svelte"
  import type { FieldType } from "@undb/table"
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte"
  import FieldTypePicker from "./field-type-picker.svelte"

  export let table = getTable()

  interface IField {
    id: string
    value: string
    label: string
    type: FieldType
  }

  $: fields =
    $table.getOrderedFields().map<IField>((f) => ({
      id: f.id.value,
      value: f.id.value,
      label: f.name.value,
      type: f.type,
    })) ?? []

  let open = false
  export let value: string | undefined = undefined
  export let filter: ((field: IField) => boolean) | undefined = undefined
  export let onValueChange: ((value: FieldType | undefined, prev: FieldType) => void) | undefined = undefined

  $: filteredFields = filter ? fields.filter(filter) : fields

  $: selected = fields.find((f) => f.value === value)
  $: selectedValue = selected?.label ?? "Select a field..."

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
      class={cn("justify-between", $$restProps.class)}
      {...$$restProps}
    >
      <span class="flex items-center overflow-hidden text-ellipsis" title={selectedValue}>
        {#if selected}
          <FieldIcon field={selected} type={selected.type} class="mr-2 h-3 w-3" />
        {/if}
        {selectedValue}
      </span>
      <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0">
    <Command.Root
      filter={(value, search) => {
        const label = filteredFields.find((f) => f.value === value)?.label ?? ""
        return label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
      }}
    >
      <Command.Input placeholder="Search field..." class="h-9" />
      <Command.Empty>No field found.</Command.Empty>
      <Command.Group>
        <ScrollArea class="-mx-1 h-[300px]">
          {#each filteredFields as field}
            <Command.Item
              value={field.value}
              onSelect={(currentValue) => {
                onValueChange?.(value, currentValue)
                value = currentValue
                closeAndFocusTrigger(ids.trigger)
              }}
            >
              <Check class={cn("mr-2 h-4 w-4", value !== field.value && "text-transparent")} />
              <div class="flex items-center gap-2 text-xs">
                <FieldIcon {field} type={field.type} class="h-3 w-3" />
                <span>
                  {field.label}
                </span>
              </div>
            </Command.Item>
          {/each}
        </ScrollArea>
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
