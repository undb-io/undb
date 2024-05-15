<script lang="ts">
  import CalendarIcon from "lucide-svelte/icons/calendar"
  import { type DateValue, DateFormatter, getLocalTimeZone, parseDate } from "@internationalized/date"
  import { cn } from "$lib/utils.js"
  import { Button } from "$lib/components/ui/button"
  import { Calendar } from "$lib/components/ui/calendar"
  import * as Popover from "$lib/components/ui/popover"

  const df = new DateFormatter("en-US", {
    dateStyle: "long",
  })

  export let value: string | undefined = undefined
  $: internalDate = value ? parseDate(value) : undefined
</script>

<Popover.Root openFocus>
  <Popover.Trigger asChild let:builder>
    <Button
      variant="outline"
      {...$$restProps}
      class={cn("justify-start text-left font-normal", !value && "text-muted-foreground", $$restProps.class)}
      builders={[builder]}
    >
      <CalendarIcon class="mr-2 h-4 w-4" />
      {internalDate ? df.format(internalDate.toDate(getLocalTimeZone())) : ""}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <Calendar
      value={internalDate}
      onValueChange={(v) => {
        if (v) {
          value = v.toString()
        } else {
          value = undefined
        }
      }}
      initialFocus
    />
  </Popover.Content>
</Popover.Root>
