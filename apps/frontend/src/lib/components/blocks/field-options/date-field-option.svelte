<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox"
  import NumberInput from "$lib/components/ui/input/number-input.svelte"
  import { Label } from "$lib/components/ui/label/index.js"
  import { Separator } from "$lib/components/ui/separator"
  import type { IDateFieldConstraint, INumberFieldConstraint } from "@undb/table"
  import * as Popover from "$lib/components/ui/popover"
  import { Button } from "$lib/components/ui/button"
  import { cn } from "$lib/utils"
  import { CalendarIcon } from "lucide-svelte"
  import { DateFormatter, getLocalTimeZone, parseDate } from "@internationalized/date"
  import { isDate, isString } from "radash"
  import { Calendar } from "$lib/components/ui/calendar"

  const df = new DateFormatter("en-US", {
    dateStyle: "long",
  })

  export let constraint: IDateFieldConstraint | undefined
  export let display: boolean | undefined
  export let defaultValue: string | Date | undefined
  export let placeholder: string | undefined = "Default value..."
  export let disabled: boolean | undefined

  function parse(value: string) {
    try {
      return parseDate(value)
    } catch {
      return undefined
    }
  }
  $: internalDate = isString(defaultValue)
    ? parse(defaultValue)
    : isDate(defaultValue)
      ? parseDate(defaultValue.toISOString())
      : undefined
  let open = false
</script>

<div class="space-y-2">
  <div class="space-y-1">
    <Label for="defaultValue" class="text-xs font-normal">Default value</Label>
    <Popover.Root portal="body" bind:open openFocus>
      <Popover.Trigger asChild let:builder>
        <Button
          variant="outline"
          {...$$restProps}
          {disabled}
          class={cn(
            "w-full justify-start text-left font-normal",
            !defaultValue && "text-muted-foreground",
            $$restProps.class,
          )}
          builders={[builder]}
        >
          <CalendarIcon class="mr-2 h-4 w-4" />
          {#if internalDate}
            {df.format(internalDate.toDate(getLocalTimeZone()))}
          {:else}
            <span class="text-muted-foreground text-xs">
              {placeholder}
            </span>
          {/if}
        </Button>
      </Popover.Trigger>
      <Popover.Content class="p-0" align="start">
        <Calendar
          value={internalDate}
          onValueChange={(v) => {
            if (v) {
              defaultValue = v.toString()
            } else {
              defaultValue = undefined
            }
            open = false
          }}
          initialFocus
        />
      </Popover.Content>
    </Popover.Root>
  </div>
  {#if constraint}
    <div class="pt-2">
      <Separator />
    </div>
    <div class="flex items-center space-x-2">
      <Checkbox id="required" bind:checked={constraint.required} />
      <Label for="required" class="text-xs font-normal">Mark as required field.</Label>
    </div>

    <div class="flex items-center space-x-2">
      <Checkbox id="display" bind:checked={display} />
      <Label for="display" class="text-xs font-normal">Mark as display field.</Label>
    </div>
  {/if}
</div>
