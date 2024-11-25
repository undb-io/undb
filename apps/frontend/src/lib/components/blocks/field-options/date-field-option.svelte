<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox"
  import { Label } from "$lib/components/ui/label/index.js"
  import { Separator } from "$lib/components/ui/separator"
  import {
    DEFAULT_DATE_FIELD_OPTION,
    type IDateFieldOption,
    isDateFieldMacro,
    type IDateFieldConstraint,
  } from "@undb/table"
  import * as Popover from "$lib/components/ui/popover"
  import { Button } from "$lib/components/ui/button"
  import { cn } from "$lib/utils"
  import { CalendarIcon } from "lucide-svelte"
  import { DateFormatter, getLocalTimeZone, parseDate } from "@internationalized/date"
  import { isDate, isString } from "radash"
  import { Calendar } from "$lib/components/ui/calendar"
  import DateMacroPicker from "../date/date-macro-picker.svelte"
  import DateMacro from "../date/date-macro.svelte"
  import DateFormatterPicker from "../date/date-formatter-picker.svelte"
  import TimeFormatterPicker from "../date/time-formatter-picker.svelte"
  import { Switch } from "$lib/components/ui/switch"
  import { LL } from "@undb/i18n/client"

  const df = new DateFormatter("en-US", {
    dateStyle: "long",
  })

  export let constraint: IDateFieldConstraint | undefined
  export let display: boolean | undefined
  export let defaultValue: string | Date | undefined
  export let placeholder: string | undefined = $LL.table.field.defaultValue.placeholder()
  export let disabled: boolean | undefined
  export let option: IDateFieldOption = DEFAULT_DATE_FIELD_OPTION

  function parse(value: string) {
    try {
      return parseDate(value)
    } catch {
      return undefined
    }
  }
  $: internalDate = isString(defaultValue)
    ? isDateFieldMacro(defaultValue)
      ? defaultValue
      : parse(defaultValue)
    : isDate(defaultValue)
      ? parseDate(defaultValue.toISOString())
      : undefined
  let open = false
</script>

<div class="space-y-2">
  <div class="space-y-1">
    <Label for="defaultValue" class="text-xs font-normal">{$LL.table.field.defaultValue.label()}</Label>
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
          {#if isString(internalDate) && isDateFieldMacro(internalDate)}
            <DateMacro value={internalDate} />
          {:else}
            <CalendarIcon class="mr-2 h-4 w-4" />
            {#if internalDate}
              {df.format(internalDate.toDate(getLocalTimeZone()))}
            {:else}
              <span class="text-muted-foreground text-xs">
                {placeholder}
              </span>
            {/if}
          {/if}
        </Button>
      </Popover.Trigger>
      <Popover.Content class="p-0" align="start">
        <div class="p-1">
          <DateMacroPicker
            onValueChange={(v) => {
              open = false
            }}
            bind:value={defaultValue}
          />
        </div>
        <Calendar
          value={isString(internalDate) && isDateFieldMacro(internalDate) ? undefined : internalDate}
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

  <div>
    <Label for="format" class="text-xs font-normal">{$LL.table.field.date.format()}</Label>
    <DateFormatterPicker id="format" bind:value={option.format} />
  </div>

  <div class="inline-flex items-center gap-2">
    <Switch size="sm" id="includeTime" bind:checked={option.includeTime} />
    <Label for="includeTime" class="text-xs font-normal">{$LL.table.field.date.includeTime()}</Label>
  </div>

  {#if option.includeTime}
    <div>
      <Label for="timeFormat" class="text-xs font-normal">{$LL.table.field.date.timeFormat()}</Label>
      <TimeFormatterPicker id="timeFormat" bind:value={option.timeFormat} />
    </div>
  {/if}

  {#if constraint}
    <div class="pt-2">
      <Separator />
    </div>
    <div class="flex items-center space-x-2">
      <Checkbox id="required" bind:checked={constraint.required} />
      <Label for="required" class="text-xs font-normal">{$LL.table.field.defaultValue.markAsRequired()}</Label>
    </div>

    <div class="flex items-center space-x-2">
      <Checkbox id="display" bind:checked={display} />
      <Label for="display" class="text-xs font-normal">{$LL.table.field.display.markAsDisplay()}</Label>
    </div>
  {/if}
</div>
