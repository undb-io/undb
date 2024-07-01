<script lang="ts">
  import { trpc } from "$lib/trpc/client"
  import { cn } from "$lib/utils"
  import { createMutation } from "@tanstack/svelte-query"
  import type { DateField } from "@undb/table"
  import { toast } from "svelte-sonner"
  import CalendarIcon from "lucide-svelte/icons/calendar"
  import { DateFormatter, getLocalTimeZone, parseDate } from "@internationalized/date"
  import { Button } from "$lib/components/ui/button"
  import { Calendar } from "$lib/components/ui/calendar"
  import * as Popover from "$lib/components/ui/popover"
  import { isString, isDate } from "radash"

  const df = new DateFormatter("en-US", {
    dateStyle: "long",
  })

  export let tableId: string
  export let field: DateField
  export let value: string | Date | undefined = undefined
  $: internalDate = isString(value) ? parseDate(value) : isDate(value) ? parseDate(value.toISOString()) : undefined
  export let recordId: string
  export let isEditing: boolean

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

{#if isEditing}
  <Popover.Root bind:open openFocus>
    <Popover.Trigger class="w-full">
      <div class={$$restProps.class}>
        {value}
      </div>
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
          $updateCell.mutate({
            tableId,
            id: recordId,
            values: { [field.id.value]: value },
          })
        }}
      />
    </Popover.Content>
  </Popover.Root>
{:else}
  <div class={$$restProps.class}>
    {value}
  </div>
{/if}
