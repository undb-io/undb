<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte"
  import * as Popover from "$lib/components/ui/popover"
  import { monthStore } from "$lib/store/calendar.store"
  import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-svelte"
  import CalendarViewMiniMonth from "./calendar-view-mini-month.svelte"
  import { format } from "date-fns"
</script>

<Button variant="secondary" size="xs" on:click={() => monthStore.prevMonth()}>
  <ChevronLeftIcon class="size-3 font-semibold text-gray-500" />
</Button>
<Popover.Root>
  <Popover.Trigger>
    <Button variant="secondary" size="xs">
      {format($monthStore.currentDate, "yyyy-MM")}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="px-0 py-2">
    <CalendarViewMiniMonth />
  </Popover.Content>
</Popover.Root>
<Button variant="secondary" size="xs" on:click={() => monthStore.nextMonth()}>
  <ChevronRightIcon class="size-3 font-semibold text-gray-500" />
</Button>
