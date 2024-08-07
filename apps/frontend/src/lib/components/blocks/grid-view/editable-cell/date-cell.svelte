<script lang="ts">
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import type { DateField } from "@undb/table"
  import { toast } from "svelte-sonner"
  import { parseAbsolute } from "@internationalized/date"
  import { Calendar } from "$lib/components/ui/calendar"
  import * as Popover from "$lib/components/ui/popover"
  import { isString, isDate } from "radash"
  import { format } from "date-fns/fp"

  const formatter = format("yyyy-MM-dd")

  export let tableId: string
  export let field: DateField
  export let value: string | Date | undefined = undefined
  function parse(value: string) {
    try {
      return parseAbsolute(value, "UTC")
    } catch {
      return undefined
    }
  }
  $: internalDate = isString(value)
    ? parse(value)
    : isDate(value)
      ? parseAbsolute(value.toISOString(), "UTC")
      : undefined
  export let recordId: string
  export let isEditing: boolean
  export let onValueChange = (value: string | undefined) => {}

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
              value = v.toDate("UTC").toISOString()
            } else {
              value = undefined
            }
            onValueChange(value)
            $updateCell.mutate({
              tableId,
              id: recordId,
              values: { [field.id.value]: value },
            })
          }}
        />
      </Popover.Content>
    </Popover.Root>
  {:else if value}
    {#if value}
      {formatter(value)}
    {/if}
  {/if}
</div>
