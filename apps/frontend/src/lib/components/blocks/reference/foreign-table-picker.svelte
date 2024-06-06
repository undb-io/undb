<script lang="ts">
  import Check from "svelte-radix/Check.svelte"
  import CaretSort from "svelte-radix/CaretSort.svelte"
  import { tick } from "svelte"
  import * as Command from "$lib/components/ui/command/index.js"
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import { cn } from "$lib/utils.js"
  import { getTable } from "$lib/store/table.store"
  import { GetForeignTablesStore } from "$houdini"

  const table = getTable()

  const foreignTableStore = new GetForeignTablesStore()

  $: foreignTableStore.fetch()
  $: foreignTables = $foreignTableStore.data?.tables ?? []

  $: foreignTablesOptions = foreignTables.map((t) => ({ value: t.id, label: t.name }))

  let open = false
  export let value: string | undefined = undefined

  $: selectedValue = foreignTablesOptions.find((f) => f.value === value)?.label ?? "Select a table..."

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger(triggerId: string) {
    open = false
    tick().then(() => {
      document.getElementById(triggerId)?.focus()
    })
  }
</script>

<Popover.Root bind:open let:ids>
  <Popover.Trigger asChild let:builder>
    <Button builders={[builder]} variant="outline" role="combobox" aria-expanded={open} class="w-full justify-between">
      {selectedValue}
      <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </Popover.Trigger>
  <Popover.Content class="p-0">
    <Command.Root
      filter={(value, search) => {
        const label = foreignTablesOptions.find((t) => t.value === value)?.label ?? ""
        return label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
      }}
    >
      <Command.Input placeholder="Search table..." class="h-9" />
      <Command.Empty>No Table found.</Command.Empty>
      <Command.Group>
        {#each foreignTablesOptions as table}
          <Command.Item
            value={table.value}
            onSelect={(currentValue) => {
              value = currentValue
              closeAndFocusTrigger(ids.trigger)
            }}
          >
            <Check class={cn("mr-2 h-4 w-4", value !== table.value && "text-transparent")} />
            {table.label}
          </Command.Item>
        {/each}
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
