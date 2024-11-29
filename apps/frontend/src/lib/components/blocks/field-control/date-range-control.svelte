<script lang="ts">
  import { parseAbsolute, getLocalTimeZone } from "@internationalized/date"
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js"
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { isString } from "radash"
  import { isDate } from "date-fns"
  import { DateRangeField } from "@undb/table"
  import { cn } from "$lib/utils.js"
  import Button from "$lib/components/ui/button/button.svelte"
  import TimePicker from "$lib/components/blocks/date/time-picker.svelte"
  import { LL } from "@undb/i18n/client"

  type Value = [string | Date | null | undefined, string | Date | null | undefined] | undefined | null

  export let readonly = false
  export let disabled = false
  export let tableId: string
  export let recordId: string
  export let value: Value = undefined

  $: startDate = value?.[0]
  $: endDate = value?.[1]

  function parse(value: string) {
    try {
      return parseAbsolute(value, getLocalTimeZone())
    } catch (e) {
      return undefined
    }
  }

  function getCalendarDate(value: string | Date | null | undefined) {
    return isString(value) ? parse(value) : isDate(value) ? parse(value.toISOString()) : undefined
  }

  $: internalValue = {
    start: getCalendarDate(value?.[0]),
    end: getCalendarDate(value?.[1]),
  }

  export let field: DateRangeField
  $: formatter = field.formatter
  $: includeTime = field.includeTime

  export let onValueChange: (value: Value) => void | undefined

  let open = false
</script>

<div class={$$restProps.class}>
  <Popover.Root openFocus bind:open>
    <Popover.Trigger asChild let:builder>
      <Button
        disabled={readonly || disabled}
        variant="outline"
        {...$$restProps}
        class={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground", $$restProps.class)}
        builders={[builder]}
      >
        {#if internalValue && internalValue.start}
          {#if internalValue.end}
            <span class="flex items-center gap-1">
              <span class="rounded-sm border bg-gray-50 px-1 py-0.5">
                {formatter(internalValue.start.toDate())}
              </span>
              <span class="mx-1 text-xs text-gray-500"> - </span>
              <span class="rounded-sm border bg-gray-50 px-1 py-0.5">
                {formatter(internalValue.end.toDate())}
              </span>
            </span>
          {:else}
            <span class="rounded-sm border bg-gray-50 px-1 py-0.5">
              {formatter(internalValue.start.toDate())}
            </span>
          {/if}
        {:else if value?.[0]}
          <span class="rounded-sm border bg-gray-50 px-1 py-0.5">
            {formatter(new Date(value[0]))}
          </span>
        {/if}
      </Button>
    </Popover.Trigger>
    <Popover.Content class="w-auto p-0" align="start">
      <RangeCalendar
        onValueChange={(v) => {
          const start = v.start?.toDate(getLocalTimeZone())
          const end = v.end?.toDate(getLocalTimeZone())

          const startDate = start ? start.toISOString() : undefined
          const endDate = end ? end.toISOString() : undefined

          value = [startDate, endDate]
          onValueChange?.(value)
        }}
        value={internalValue}
        placeholder={internalValue?.start}
        initialFocus
        numberOfMonths={2}
      />
      {#if includeTime}
        <div class="flex items-center gap-2 p-2 pt-0">
          <div class="flex-1">
            <TimePicker
              disabled={!startDate}
              value={{
                hour: startDate ? new Date(startDate).getHours() : 0,
                minute: startDate ? new Date(startDate).getMinutes() : 0,
              }}
              onValueChange={(v) => {
                if (!startDate) return
                startDate = new Date(new Date(startDate).setHours(v.hour, v.minute, 0, 0)).toISOString()
                value = [startDate, endDate]
                onValueChange?.(value)
              }}
            />
          </div>
          <div class="flex-1">
            <TimePicker
              disabled={!endDate}
              value={{
                hour: endDate ? new Date(endDate).getHours() : 0,
                minute: endDate ? new Date(endDate).getMinutes() : 0,
              }}
              onValueChange={(v) => {
                if (!endDate) return
                endDate = new Date(new Date(endDate).setHours(v.hour, v.minute, 0, 0)).toISOString()
                value = [startDate, endDate]
                onValueChange?.(value)
              }}
            />
          </div>
        </div>
      {/if}

      <div class="flex items-center gap-2 border-t p-2">
        <Button
          variant="outline"
          class="flex-1"
          on:click={() => {
            value = null
            onValueChange?.(null)
            open = false
          }}
        >
          {$LL.common.clear()}
        </Button>
        {#if includeTime}
          <Button
            class="flex-1"
            on:click={() => {
              open = false
            }}
          >
            {$LL.common.save()}
          </Button>
        {/if}
      </div>
    </Popover.Content>
  </Popover.Root>
</div>
