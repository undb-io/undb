<script lang="ts">
  import CalendarIcon from "lucide-svelte/icons/calendar"
  import { DateFormatter, getLocalTimeZone, parseDate } from "@internationalized/date"
  import { cn } from "$lib/utils.js"
  import { Button } from "$lib/components/ui/button"
  import { Calendar } from "$lib/components/ui/calendar"
  import * as Popover from "$lib/components/ui/popover"
  import { isDate, isString } from "radash"
  import { format } from "date-fns/fp"

  export let readonly = false
  const formatter = format("yyyy-MM-dd")

  export let value: string | Date | undefined = undefined
  function parse(value: string) {
    try {
      return parseDate(value)
    } catch {
      return undefined
    }
  }
  $: internalDate = isString(value) ? parse(value) : isDate(value) ? parse(value.toISOString()) : undefined

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
      {#if value}
        {formatter(value)}
      {/if}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="p-0" side="bottom" align="start">
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
    <div class="border-t px-2 py-1">
      <Button
        class="w-full"
        variant="outline"
        on:click={() => {
          if (value) {
            value = undefined
          }
          open = false
        }}>Clear</Button
      >
    </div>
  </Popover.Content>
</Popover.Root>
