<script lang="ts">
  import { parseAbsolute, type DateValue, getLocalTimeZone } from "@internationalized/date"
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js"
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { isString } from "radash"
  import { isDate } from "date-fns"
  import { DateRangeField } from "@undb/table"
  import { createMutation } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"
  import { trpc } from "$lib/trpc/client.js"

  export let tableId: string
  export let recordId: string
  export let value: [string | Date | null | undefined, string | Date | null | undefined] | undefined = undefined

  function parse(value: string) {
    try {
      return parseAbsolute(value, getLocalTimeZone())
    } catch (e) {
      console.log(e)
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

  let startValue: DateValue | undefined = undefined

  export let field: DateRangeField
  export let isEditing = false
  let formatter = field.formatter

  export let onValueChange: (value: [string | Date | null | undefined, string | Date | null | undefined]) => void

  let open = false
  $: if (isEditing) {
    open = true
  }

  const updateCell = createMutation({
    mutationKey: ["record", tableId, field.id.value, recordId],
    mutationFn: trpc.record.update.mutate,
    onSuccess(data, variables, context) {
      open = false
    },
    onError(error: Error) {
      toast.error(error.message)
    },
  })
</script>

<div class={$$restProps.class}>
  <Popover.Root openFocus bind:open>
    <Popover.Trigger class="h-full w-full text-left outline-none ring-0">
      {#if internalValue && internalValue.start}
        {#if internalValue.end}
          {formatter(internalValue.start.toDate())} - {formatter(internalValue.end.toDate())}
        {:else}
          {formatter(internalValue.start.toDate())}
        {/if}
      {:else if startValue}
        {formatter(startValue.toDate(getLocalTimeZone()))}
      {/if}
    </Popover.Trigger>
    <Popover.Content class="w-auto p-0">
      <RangeCalendar
        onValueChange={(v) => {
          const start = v.start?.toString()
          const end = v.end?.toString()
          const startDate = start ? new Date(start).toISOString() : undefined
          const endDate = end ? new Date(end).toISOString() : undefined

          value = [startDate, endDate]
          onValueChange(value)
          $updateCell.mutate({
            tableId,
            id: recordId,
            values: { [field.id.value]: value },
          })
        }}
        value={internalValue}
        bind:startValue
        placeholder={internalValue?.start}
        initialFocus
        numberOfMonths={2}
      />
    </Popover.Content>
  </Popover.Root>
</div>
