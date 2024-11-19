<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte"
  import * as Popover from "$lib/components/ui/popover"
  import { calendarStore } from "$lib/store/calendar.store"
  import { ChevronLeftIcon, ChevronRightIcon } from "lucide-svelte"
  import CalendarViewMiniMonth from "./calendar-view-mini-month.svelte"
  import { format } from "date-fns"
  import CalendarViewMiniDay from "./calendar-view-mini-day.svelte"
  import { type CalendarView } from "@undb/table"

  export let view: CalendarView
  $: timeScale = view.timeScale
  let open = false

  let onChange: (date: Date) => void = () => {
    open = false
  }

  let startOfWeek = calendarStore.startOfWeekTimestamp
  let endOfWeek = calendarStore.endOfWeekTimestamp
</script>

<Button
  variant="secondary"
  size="xs"
  on:click={() => {
    if (timeScale === "day") {
      calendarStore.prevDay()
    } else if (timeScale === "week") {
      calendarStore.prevWeek()
    } else {
      calendarStore.prevMonth()
    }
  }}
>
  <ChevronLeftIcon class="size-3 font-semibold text-gray-500" />
</Button>
<Popover.Root bind:open>
  <Popover.Trigger>
    <Button variant="secondary" size="xs">
      {#if timeScale === "day"}
        {format($calendarStore.selectedDate, "yyyy-MM-dd")}
      {:else if timeScale === "week"}
        {$startOfWeek && format($startOfWeek, "yyyy-MM-dd")}
        -
        {$endOfWeek && format($endOfWeek, "yyyy-MM-dd")}
      {:else}
        {format($calendarStore.selectedDate, "yyyy-MM")}
      {/if}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="px-0 py-2">
    {#if timeScale === "day"}
      <CalendarViewMiniDay {onChange} />
    {:else if timeScale === "week"}
      <CalendarViewMiniDay {onChange} />
    {:else}
      <CalendarViewMiniMonth {onChange} />
    {/if}
  </Popover.Content>
</Popover.Root>
<Button
  variant="secondary"
  size="xs"
  on:click={() => {
    if (timeScale === "day") {
      calendarStore.nextDay()
    } else if (timeScale === "week") {
      calendarStore.nextWeek()
    } else {
      calendarStore.nextMonth()
    }
  }}
>
  <ChevronRightIcon class="size-3 font-semibold text-gray-500" />
</Button>
