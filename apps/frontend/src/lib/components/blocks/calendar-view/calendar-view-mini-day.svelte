<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { cn } from "$lib/utils"
  import { ChevronLeftIcon, ChevronRightIcon } from "lucide-svelte"
  import { format, isToday } from "date-fns"
  import { calendarStore } from "$lib/store/calendar.store"

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"]

  // 使用 store 中的方法
  const { nextMonth, prevMonth, select, getIsSameMonth, isSelected } = calendarStore

  export let onChange: (date: Date) => void = () => {}
</script>

<div class="w-full bg-white shadow-sm">
  <div class="flex items-center justify-between p-4">
    <Button variant="ghost" size="icon" class="h-7 w-7" on:click={prevMonth}>
      <ChevronLeftIcon class="size-4" />
    </Button>
    <div class="text-sm font-medium">
      {format($calendarStore.selectedDate, "MMMM yyyy")}
    </div>
    <Button variant="ghost" size="icon" class="h-7 w-7" on:click={nextMonth}>
      <ChevronRightIcon class="size-4" />
    </Button>
  </div>

  <div class="grid grid-cols-7 gap-0.5 px-4">
    {#each weekDays as day}
      <div class="text-center text-sm text-gray-500">
        {day}
      </div>
    {/each}
  </div>

  <div class="grid grid-cols-7 gap-0.5 p-4">
    {#each $calendarStore.dates as date}
      {@const isDateSelected = $isSelected(date)}
      {@const isCurrentMonth = $getIsSameMonth(date)}
      {@const isCurrentDay = isToday(date)}
      <button
        class={cn(
          "flex h-8 w-8 items-center justify-center rounded-md text-sm",
          !isCurrentMonth && "text-gray-400",
          isDateSelected && "bg-gray-100",
          isCurrentDay && !isDateSelected && "font-semibold text-blue-500",
          isCurrentMonth && !isDateSelected && "hover:bg-gray-50",
        )}
        disabled={!isCurrentMonth}
        on:click={() => {
          select(date)
          onChange(date)
        }}
      >
        {format(date, "d")}
        {#if isCurrentDay}
          <div class="absolute mt-5 h-1 w-1 rounded-full bg-blue-500"></div>
        {/if}
      </button>
    {/each}
  </div>
</div>
