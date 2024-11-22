<script lang="ts">
  import Check from "svelte-radix/Check.svelte"
  import CaretSort from "svelte-radix/CaretSort.svelte"
  import { tick } from "svelte"
  import * as Command from "$lib/components/ui/command/index.js"
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import { cn } from "$lib/utils.js"
  import { getTable } from "$lib/store/table.store"
  import { GetForeignTablesStore, GetForeignTableStore } from "$houdini"
  import { group } from "radash"
  import { DatabaseIcon, ChevronRightIcon, ExternalLinkIcon } from "lucide-svelte"

  const table = getTable()

  const getForeignTablesStore = new GetForeignTablesStore()
  const getForeignTableStore = new GetForeignTableStore()

  $: open && getForeignTablesStore.fetch()
  $: foreignTables = $getForeignTablesStore.data?.tables.filter((t) => !!t) ?? []
  $: groupTables = group(foreignTables, (t) => t.base?.id)

  let open = false
  export let value: string | undefined = undefined
  export let disabled: boolean = false

  $: foreignBase = $getForeignTableStore.data?.table?.base

  $: selectedValue =
    foreignTables.filter((f) => !!f).find((f) => f.id === value)?.name ?? $getForeignTableStore.data?.table?.name ?? ""
  let fetched = false
  $: if (value && !selectedValue && !fetched) {
    getForeignTableStore.fetch({ variables: { tableId: value } }).then(() => {
      fetched = true
    })
  }

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

<Popover.Root bind:open let:ids portal="body">
  <Popover.Trigger asChild let:builder>
    <div class="flex items-center gap-2">
      <Button
        builders={[builder]}
        variant="outline"
        role="combobox"
        size="sm"
        aria-expanded={open}
        class={cn("w-full justify-between", $$restProps.class)}
        {disabled}
      >
        {#if selectedValue}
          <span class="inline-flex items-center gap-1 truncate text-xs text-gray-700">
            {#if foreignBase}
              {foreignBase.name}
              <ChevronRightIcon class="size-3 shrink-0 opacity-50" />
            {/if}
            {selectedValue}
          </span>
        {:else}
          <span class="text-muted-foreground"> Select a table... </span>
        {/if}
        <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      {#if value}
        <a href={`/t/${value}`} class="text-muted-foreground">
          <ExternalLinkIcon class="mr-2 h-3 w-3" />
        </a>
      {/if}
    </div>
  </Popover.Trigger>
  <Popover.Content class="max-h-[300px] overflow-y-auto p-0" sameWidth>
    <Command.Root
      filter={(value, search) => {
        const label = foreignTables.filter((f) => !!f).find((t) => t.id === value)?.name ?? ""
        return label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
      }}
    >
      <Command.Input placeholder="Search table..." class="h-9" />
      <Command.Empty>No Table found.</Command.Empty>
      {#each Object.entries(groupTables) as [baseId, tables]}
        {#if tables?.length}
          {@const baseName = tables[0].base.name}
          <Command.Group heading={baseName}>
            {#each tables as t}
              {#if t}
                <Command.Item
                  value={t.id}
                  onSelect={(currentValue) => {
                    value = currentValue
                    closeAndFocusTrigger(ids.trigger)
                  }}
                  class="gap-2"
                >
                  <Check class={cn("h-4 w-4", value !== t.id && "text-transparent")} />
                  <span class="inline-flex items-center gap-2 truncate text-xs text-gray-700">
                    <DatabaseIcon class="h-4 w-4" />
                    {t.name}
                  </span>
                  {#if t.id === $table?.id.value}
                    <span
                      class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                    >
                      Current
                    </span>
                  {/if}
                </Command.Item>
              {/if}
            {/each}
          </Command.Group>
        {/if}
      {/each}
    </Command.Root>
  </Popover.Content>
</Popover.Root>
