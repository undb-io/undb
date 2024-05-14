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

  const table = getTable()

  $: fields = $table.schema.fields.map((f) => ({ value: f.id.value, label: f.name.value, type: f.type })) ?? []

  let open = false
  export let value: string | undefined = undefined

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
    >
      <span class="flex items-center overflow-hidden text-ellipsis" title={selectedValue}>
        {#if selected}
          <FieldIcon type={selected.type} class="mr-2 h-3 w-3" />
        {/if}
        {selectedValue}
      </span>
      <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0">
    <Command.Root
      filter={(value, search) => {
        const label = fields.find((f) => f.value === value)?.label ?? ""
        return label.toLowerCase().includes(search.toLowerCase())
      }}
    >
      <Command.Input placeholder="Search field..." class="h-9" />
      <Command.Empty>No field found.</Command.Empty>
      <Command.Group>
        {#each fields as field}
          <Command.Item
            value={field.value}
            onSelect={(currentValue) => {
              value = currentValue
              closeAndFocusTrigger(ids.trigger)
            }}
          >
            <Check class={cn("mr-2 h-4 w-4", value !== field.value && "text-transparent")} />
            <div class="flex items-center gap-2">
              <FieldIcon type={field.type} class="h-4 w-4" />
              <span>
                {field.label}
              </span>
            </div>
          </Command.Item>
        {/each}
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
