<script lang="ts">
  import CalendarIcon from "lucide-svelte/icons/calendar"
  import { DateFormatter, getLocalTimeZone, parseDate, fromDate } from "@internationalized/date"
  import { cn } from "$lib/utils.js"
  import { Button } from "$lib/components/ui/button"
  import { Calendar } from "$lib/components/ui/calendar"
  import * as Popover from "$lib/components/ui/popover"
  import { isDate, isString } from "radash"

  export let readonly = false

  const df = new DateFormatter("en-US", {
    dateStyle: "long",
  })

  export let value: string | Date | undefined = undefined
  $: internalDate = isString(value) ? parseDate(value) : isDate(value) ? parseDate(value.toISOString()) : undefined

  let open = false
</script>

<Popover.Root bind:open openFocus>
  <Popover.Trigger asChild let:builder>
    <Button
      disabled={readonly}
      variant="outline"
      {...$$restProps}
      class={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground", $$restProps.class)}
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
        open = false
      }}
      initialFocus
    />
  </Popover.Content>
</Popover.Root>
