<script lang="ts">
  import Check from "svelte-radix/Check.svelte"
  import CaretSort from "svelte-radix/CaretSort.svelte"
  import { tick } from "svelte"
  import * as Command from "$lib/components/ui/command/index.js"
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import { cn } from "$lib/utils.js"
  import { DatabaseIcon } from "lucide-svelte"
  import { LL } from "@undb/i18n/client"
  import { createQuery } from "@tanstack/svelte-query"
  import { getDataService } from "$lib/store/data-service.store"

  export let value: string | undefined = undefined
  export let disabled: boolean = false
  export let baseId: string

  const dataService = getDataService()

  const getTables = createQuery({
    queryFn: async () => {
      return dataService.table.getTables({ baseId })
    },
    queryKey: ["tables", baseId],
  })

  let open = false
  $: open && $getTables.refetch()
  $: tables = $getTables.data?.filter((t) => !!t) ?? []

  $: selectedValue = tables.find((t) => t.id === value)?.name ?? ""

  function closeAndFocusTrigger(triggerId: string) {
    open = false
    tick().then(() => {
      document.getElementById(triggerId)?.focus()
    })
  }
</script>

<Popover.Root bind:open let:ids portal="body">
  <Popover.Trigger asChild let:builder>
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
        <span class="flex items-center gap-2">
          <DatabaseIcon class="text-muted-foreground h-4 w-4" />
          {selectedValue}
        </span>
      {:else}
        <span class="text-muted-foreground"> {$LL.table.common.select()} </span>
      {/if}
      <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </Popover.Trigger>
  <Popover.Content class="max-h-[300px] overflow-y-auto p-0" sameWidth>
    <Command.Root
      filter={(value, search) => {
        const label = tables.find((t) => t.id === value)?.name ?? ""
        return label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
      }}
    >
      <Command.Input placeholder={$LL.table.common.search()} class="h-9 text-xs" />
      <Command.Empty>{$LL.table.common.noTablesFound()}</Command.Empty>
      <Command.Group>
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
              <span class="flex items-center gap-2">
                <DatabaseIcon class="text-muted-foreground h-4 w-4" />
                {t.name}
              </span>
            </Command.Item>
          {/if}
        {/each}
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
