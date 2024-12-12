<script lang="ts">
  import Check from "svelte-radix/Check.svelte"
  import CaretSort from "svelte-radix/CaretSort.svelte"
  import { tick } from "svelte"
  import * as Command from "$lib/components/ui/command/index.js"
  import * as Popover from "$lib/components/ui/popover/index.js"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { Button } from "$lib/components/ui/button/index.js"
  import { cn } from "$lib/utils.js"
  import { LL } from "@undb/i18n/client"
  import { calendarTimeScales, type CalendarTimeScale, type CalendarView } from "@undb/table"
  import { createMutation } from "@tanstack/svelte-query"
  import { getTable } from "$lib/store/table.store"
  import { invalidate } from "$app/navigation"
  import { type ICalendarViewDTO } from "@undb/table"
  import { getDataService } from "$lib/store/data-service.store"
  import { type IUpdateViewCommand } from "@undb/commands"

  export let view: CalendarView
  const table = getTable()

  let open = false

  let search = ""

  $: filtered = calendarTimeScales.filter((scale) => {
    const label = $LL.table.timeScales[scale]() ?? scale
    return label.toLowerCase().includes(search.toLowerCase())
  })

  $: selected = view.timeScale
  $: selectedValue = selected ?? "Select time scale..."

  function closeAndFocusTrigger(triggerId: string) {
    open = false
    tick().then(() => {
      document.getElementById(triggerId)?.focus()
    })
  }

  const dataService = getDataService()

  const updateViewMutation = createMutation({
    mutationFn: async (command: IUpdateViewCommand) => {
      return dataService.table.view.updateView(command)
    },
    mutationKey: ["updateView"],
    async onSuccess(data, variables, context) {
      await invalidate(`undb:table:${$table.id.value}`)
    },
  })

  function onSelect(scale: string) {
    view.timeScale = scale as CalendarTimeScale
    const json = view.toJSON() as ICalendarViewDTO

    $updateViewMutation.mutate({
      tableId: $table.id.value,
      viewId: view.id.value,
      ...json,
      calendar: {
        ...json.calendar,
        timeScale: view.timeScale,
      },
    })
  }
</script>

<Popover.Root bind:open let:ids portal="body">
  <Popover.Trigger asChild let:builder={popoverBuilder}>
    <Tooltip.Root portal="body">
      <Tooltip.Trigger asChild let:builder>
        <Button
          size="sm"
          builders={[popoverBuilder, builder]}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          {...$$restProps}
          class={cn("w-full justify-between", $$restProps.class)}
        >
          <span class="flex items-center overflow-hidden text-ellipsis" title={selectedValue}>
            {#if selected}
              <slot>
                {$LL.table.timeScales[selected]() ?? selected}
              </slot>
            {/if}
          </span>
          <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>Select time scale</p>
      </Tooltip.Content>
    </Tooltip.Root>
  </Popover.Trigger>
  <Popover.Content class="p-0">
    <Command.Root shouldFilter={false}>
      <Command.Input bind:value={search} placeholder="Search time scale..." class="h-9" />
      <Command.Empty>No time scale found.</Command.Empty>
      <Command.Group class="max-h-[300px] overflow-y-auto">
        {#each filtered as scale}
          <Command.Item
            value={scale}
            onSelect={(value) => {
              onSelect(value)
              closeAndFocusTrigger(ids.trigger)
            }}
          >
            <Check class={cn("mr-2 h-4 w-4", selected !== scale && "text-transparent")} />
            <span class="text-xs">
              {$LL.table.timeScales[scale]() ?? scale}
            </span>
          </Command.Item>
        {/each}
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
