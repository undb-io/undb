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
  import Button from "$lib/components/ui/button/button.svelte"

  export let tableId: string
  export let recordId: string
  export let value: [string | Date | null | undefined, string | Date | null | undefined] | undefined = undefined

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
  export let isEditing = false
  export let isSelected = false
  let formatter = field.formatter

  export let onValueChange: (
    value: [string | Date | null | undefined, string | Date | null | undefined] | undefined,
  ) => void

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
  {#if isEditing}
    <Popover.Root openFocus bind:open>
      <Popover.Trigger class="h-full w-full text-left outline-none ring-0">
        {#if internalValue && internalValue.start}
          {#if internalValue.end}
            {formatter(internalValue.start.toDate())} - {formatter(internalValue.end.toDate())}
          {:else}
            {formatter(internalValue.start.toDate())}
          {/if}
        {:else if value?.[0]}
          {formatter(new Date(value[0]))}
        {/if}
      </Popover.Trigger>
      <Popover.Content class="w-auto p-0">
        <RangeCalendar
          onValueChange={(v) => {
            const start = v.start?.toDate(getLocalTimeZone())
            const end = v.end?.toDate(getLocalTimeZone())

            const startDate = start ? start.toISOString() : undefined
            const endDate = end ? end.toISOString() : undefined

            value = [startDate, endDate]
            onValueChange(value)
            if (startDate && endDate) {
              $updateCell.mutate({
                tableId,
                id: recordId,
                values: { [field.id.value]: value },
              })
            }
          }}
          value={internalValue}
          placeholder={internalValue?.start}
          initialFocus
          numberOfMonths={2}
        />

        <div class="border-t p-2">
          <Button
            variant="outline"
            class="w-full"
            on:click={() => {
              value = undefined
              onValueChange(value)
              $updateCell.mutate({
                tableId,
                id: recordId,
                values: { [field.id.value]: value },
              })
            }}
          >
            Clear
          </Button>
        </div>
      </Popover.Content>
    </Popover.Root>
  {:else if internalValue && internalValue.start}
    {#if internalValue.end}
      {formatter(internalValue.start.toDate())} - {formatter(internalValue.end.toDate())}
    {:else}
      {formatter(internalValue.start.toDate())}
    {/if}
  {:else if value?.[0]}
    {formatter(new Date(value[0]))}
  {/if}
</div>
