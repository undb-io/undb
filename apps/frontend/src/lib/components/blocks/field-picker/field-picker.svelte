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
  import { LL } from "@undb/i18n/client"

  export let table = getTable()
  export let disabled = false
  export let readonly = false

  interface IField {
    id: string
    value: string
    label: string
    type: FieldType
  }

  $: fields =
    $table?.getOrderedFields().map<IField>((f) => ({
      id: f.id.value,
      value: f.id.value,
      label: f.name.value,
      type: f.type,
    })) ?? []

  let open = false
  export let value: string | undefined = undefined
  export let filter: ((field: IField) => boolean) | undefined = undefined
  export let onValueChange: ((value: string | undefined, prev: string | undefined) => void) | undefined = undefined
  export let placeholder: string = $LL.table.field.selectField()

  $: filteredFields = filter ? fields.filter(filter) : fields

  $: selected = fields.find((f) => f.value === value)
  $: selectedValue = selected?.label

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
      class={cn("justify-between", $$restProps.class)}
      disabled={disabled || readonly}
      {...$$restProps}
    >
      <span class="flex flex-1 items-center overflow-hidden text-ellipsis" title={selectedValue}>
        {#if selected}
          <FieldIcon field={selected} type={selected.type} class="mr-2 h-3 w-3" />
        {/if}
        {#if selectedValue}
          {selectedValue}
        {:else}
          <span class="text-muted-foreground">{placeholder}</span>
        {/if}
      </span>
      <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </Popover.Trigger>
  <Popover.Content class="p-0" {sameWidth}>
    <Command.Root
      filter={(value, search) => {
        const label = filteredFields.find((f) => f.value === value)?.label ?? ""
        return label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
      }}
    >
      <Command.Input {placeholder} class="h-9 text-xs" />
      <Command.Empty class="text-muted-foreground">
        <slot name="empty">{$LL.table.field.empty()}</slot>
      </Command.Empty>
      <Command.Group>
        <div class="-mx-1 max-h-[300px] overflow-y-auto">
          {#each filteredFields as field}
            <Command.Item
              value={field.id}
              onSelect={(currentValue) => {
                onValueChange?.(currentValue, value)
                value = currentValue
                closeAndFocusTrigger(ids.trigger)
              }}
            >
              <Check class={cn("mr-2 h-4 w-4", value !== field.id && "text-transparent")} />
              <div class="flex items-center gap-2 text-xs">
                <FieldIcon {field} type={field.type} class="h-3 w-3" />
                <span>
                  {field.label}
                </span>
              </div>
            </Command.Item>
          {/each}
        </div>
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
