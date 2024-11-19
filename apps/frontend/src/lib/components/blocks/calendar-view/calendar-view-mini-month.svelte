<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { calendarStore } from "$lib/store/calendar.store"
  import { cn } from "$lib/utils"
  import { format } from "date-fns"
  import { getMonth } from "date-fns/getMonth"
  import { isSameMonth } from "date-fns/isSameMonth"
  import { ChevronLeftIcon, ChevronRightIcon } from "lucide-svelte"

  const currentYear = calendarStore.currentYear
  const currentMonth = calendarStore.currentMonth

  export let onChange: (date: Date) => void = () => {}
</script>

<div class="flex w-full flex-col">
  <div class="flex items-center px-2 py-1">
    <Button variant="ghost" size="icon" on:click={() => calendarStore.prevYear()}>
      <ChevronLeftIcon class="size-3 text-gray-500" />
    </Button>
    <span class="flex-1 text-center text-sm font-medium">{$currentYear}</span>
    <Button variant="ghost" size="icon" on:click={() => calendarStore.nextYear()}>
      <ChevronRightIcon class="size-3 text-gray-500" />
    </Button>
  </div>
  <div class="grid grid-cols-4 gap-1.5 px-1.5 py-1">
    {#each Array.from({ length: 12 }).map((_, index) => index + 1) as month}
      {@const date = new Date($currentYear, month - 1, 1)}
      {@const isCurrentMonth = $currentMonth === getMonth(date) + 1}
      {@const isNow = isSameMonth(date, new Date())}
      <button
        class={cn(
          "p-2 text-sm hover:bg-gray-100",
          isCurrentMonth && "bg-gray-200 font-semibold",
          isNow && !isCurrentMonth && "font-semibold text-blue-500",
        )}
        on:click={() => {
          calendarStore.setMonth(date)
          onChange(date)
        }}
      >
        {format(date, "MMM")}
      </button>
    {/each}
  </div>
</div>
