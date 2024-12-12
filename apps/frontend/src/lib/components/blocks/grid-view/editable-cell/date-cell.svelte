<script lang="ts">
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import type { DateField } from "@undb/table"
  import { toast } from "svelte-sonner"
  import { getLocalTimeZone, parseDate, today } from "@internationalized/date"
  import { Calendar } from "$lib/components/ui/calendar"
  import * as Popover from "$lib/components/ui/popover"
  import { isString, isDate } from "radash"
  import { Button } from "$lib/components/ui/button"
  import TimePicker from "$lib/components/blocks/date/time-picker.svelte"
  import { LL } from "@undb/i18n/client"
  import { getDataService } from "$lib/store/data-service.store"

  export let tableId: string
  export let field: DateField
  export let value: string | Date | undefined = undefined
  function parse(value: string) {
    try {
      return parseDate(value)
    } catch (e) {
      return undefined
    }
  }
  $: formatter = field.formatter
  $: includeTime = field.includeTime
  $: internalDate = isString(value) ? parse(value) : isDate(value) ? parse(value.toISOString()) : undefined
  export let recordId: string
  export let isEditing: boolean
  export let onValueChange = (value: string | undefined) => {}

  $: shouldConfirm = includeTime && value

  function save(value: string | Date | null) {
    $updateCell.mutate({
      tableId,
      id: recordId,
      values: { [field.id.value]: value },
    })
    open = false
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

  let el: HTMLInputElement
  $: if (isEditing) {
    if (el) {
      el.focus()
    }
  }

  let open = false
  $: if (isEditing) {
    open = true
  }
</script>

<div class={$$restProps.class}>
  {#if isEditing}
    <Popover.Root bind:open openFocus>
      <Popover.Trigger class="h-full w-full text-left outline-none ring-0">
        {#if value}
          {formatter(value)}
        {/if}
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
            onValueChange(value)
            if (!shouldConfirm && value) {
              save(value)
            }
          }}
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
                onValueChange(value)
                if (!shouldConfirm) {
                  save(value)
                }
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
              onValueChange(value)
              save(value)
            }}
          >
            {includeTime ? $LL.common.now() : $LL.common.today()}
          </Button>
          {#if !field.required}
            <Button
              class="flex-1"
              variant="outline"
              on:click={() => {
                if (value) {
                  value = undefined
                  onValueChange(value)
                  save(null)
                }
              }}>{$LL.common.clear()}</Button
            >
          {/if}
        </div>
        {#if shouldConfirm}
          <div class="flex items-center gap-1.5 border-t px-2 py-1">
            <Button
              class="w-full"
              on:click={() => {
                save(value ?? null)
              }}>{$LL.common.save()}</Button
            >
          </div>
        {/if}
      </Popover.Content>
    </Popover.Root>
  {:else if value}
    {#if value}
      {formatter(value)}
    {/if}
  {/if}
</div>
