<script lang="ts">
  import CalendarIcon from "lucide-svelte/icons/calendar"
  import { getLocalTimeZone, parseDate, today } from "@internationalized/date"
  import { cn } from "$lib/utils.js"
  import { Button } from "$lib/components/ui/button"
  import { Calendar } from "$lib/components/ui/calendar"
  import * as Popover from "$lib/components/ui/popover"
  import { isDate, isString } from "radash"
  import { DateField, isDateFieldMacro } from "@undb/table"
  import DateMacroPicker from "../date/date-macro-picker.svelte"
  import DateMacro from "../date/date-macro.svelte"
  import TimePicker from "../date/time-picker.svelte"

  export let readonly = false
  export let disabled = false
  export let field: DateField

  $: formatter = field.formatter
  $: includeTime = field.includeTime

  export let value: string | Date | undefined | null = undefined
  function parse(value: string) {
    if (isDateFieldMacro(value)) return value

    try {
      return parseDate(value)
    } catch {
      return undefined
    }
  }
  $: internalDate = isString(value) ? parse(value) : isDate(value) ? parse(value.toISOString()) : undefined

  let open = false

  function onChange() {
    if (!includeTime) {
      open = false
    }
  }
</script>

<Popover.Root bind:open openFocus portal="body">
  <Popover.Trigger asChild let:builder>
    <Button
      disabled={readonly || disabled}
      variant="outline"
      {...$$restProps}
      class={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground", $$restProps.class)}
      builders={[builder]}
    >
      <CalendarIcon class="mr-2 h-4 w-4" />
      {#if value}
        {#if isString(value) && isDateFieldMacro(value)}
          <DateMacro {value} />
        {:else}
          {formatter(value)}
        {/if}
      {/if}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="p-0" side="bottom" align="start">
    <div class="p-1">
      <DateMacroPicker
        onValueChange={() => {
          onChange()
        }}
        bind:value
      />
    </div>
    <Calendar
      value={isString(internalDate) && isDateFieldMacro(internalDate) ? undefined : internalDate}
      onValueChange={(v) => {
        if (v) {
          value = v.toString()
        } else {
          value = undefined
        }
        onChange()
      }}
      initialFocus
    />
    {#if includeTime}
      <div class="px-2 pb-2">
        <TimePicker
          value={{
            hour: value ? new Date(value).getHours() : 0,
            minute: value ? new Date(value).getMinutes() : 0,
          }}
          onValueChange={(v) => {
            if (!value) return
            value = new Date(new Date(value).setHours(v.hour, v.minute, 0, 0)).toISOString()
          }}
        />
      </div>
    {/if}
    <div class="flex items-center gap-1.5 border-t px-2 py-1">
      <Button
        class="flex-1"
        variant="outline"
        on:click={() => {
          value = today(getLocalTimeZone()).toString()
          onChange()
        }}>Today</Button
      >
      <Button
        class="flex-1"
        variant="outline"
        on:click={() => {
          if (value) {
            value = null
          }
          open = false
        }}
      >
        Clear
      </Button>
    </div>
  </Popover.Content>
</Popover.Root>
