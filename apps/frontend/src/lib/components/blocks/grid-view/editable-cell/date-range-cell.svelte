<script lang="ts">
  import { parseAbsolute, getLocalTimeZone } from "@internationalized/date"
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js"
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { isString } from "radash"
  import { isDate } from "date-fns"
  import { DateRangeField } from "@undb/table"
  import { createMutation } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"
  import { trpc } from "$lib/trpc/client.js"
  import Button from "$lib/components/ui/button/button.svelte"
  import TimePicker from "$lib/components/blocks/date/time-picker.svelte"
  import { LL } from "@undb/i18n/client"
  import { getDataService } from "$lib/store/data-service.store"

  type Value = [string | Date | null | undefined, string | Date | null | undefined] | undefined

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
  export let isEditing = false
  export let isSelected = false
  $: formatter = field.formatter
  $: includeTime = field.includeTime

  export let onValueChange: (value: Value) => void

  let open = false
  $: if (isEditing) {
    open = true
  }

  const dataService = getDataService()

  const updateCell = createMutation({
    mutationKey: ["record", tableId, field.id.value, recordId],
    mutationFn: dataService.records.updateRecord,
    onSuccess(data, variables, context) {
      open = false
    },
    onError(error: Error) {
      toast.error(error.message)
    },
  })

  function save(value: Value) {
    $updateCell.mutate({
      tableId,
      id: recordId,
      values: { [field.id.value]: value },
    })
    open = false
  }
</script>

<div class={$$restProps.class}>
  {#if isEditing}
    <Popover.Root openFocus bind:open>
      <Popover.Trigger class="h-full w-full overflow-hidden text-left outline-none ring-0">
        <span class="flex w-full items-center truncate">
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
        </span>
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
              if (!includeTime) {
                save(value)
              }
            }
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
                  onValueChange(value)
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
                  onValueChange(value)
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
              value = undefined
              onValueChange(value)
              $updateCell.mutate({
                tableId,
                id: recordId,
                values: { [field.id.value]: null },
              })
              open = false
            }}
          >
            {$LL.common.clear()}
          </Button>
          {#if includeTime}
            <Button
              class="flex-1"
              on:click={() => {
                save(value)
              }}
            >
              {$LL.common.save()}
            </Button>
          {/if}
        </div>
      </Popover.Content>
    </Popover.Root>
  {:else}
    <span class="flex w-full items-center truncate">
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
    </span>
  {/if}
</div>
