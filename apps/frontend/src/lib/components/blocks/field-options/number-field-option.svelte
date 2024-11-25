<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox"
  import NumberInput from "$lib/components/ui/input/number-input.svelte"
  import { Label } from "$lib/components/ui/label/index.js"
  import { Separator } from "$lib/components/ui/separator"
  import { NumberFieldConstraint, type INumberFieldConstraint } from "@undb/table"
  import * as Alert from "$lib/components/ui/alert/index.js"
  import { LL } from "@undb/i18n/client"

  export let constraint: INumberFieldConstraint | undefined
  export let display: boolean | undefined
  export let defaultValue: number | undefined
  export let disabled = false

  $: c = constraint ? new NumberFieldConstraint(constraint) : undefined
  $: isDefaultValueValid = c && defaultValue ? c.schema.safeParse(defaultValue).success : true
</script>

<div class="space-y-2">
  <div class="space-y-1">
    <Label for="defaultValue" class="text-xs font-normal">{$LL.table.field.defaultValue.label()}</Label>
    <NumberInput
      {disabled}
      id="defaultValue"
      class="bg-background flex-1 text-xs"
      placeholder={$LL.table.field.defaultValue.placeholder()}
      bind:value={defaultValue}
    />
  </div>

  {#if !isDefaultValueValid}
    <Alert.Root class="border-yellow-500 bg-yellow-50">
      <Alert.Title>{$LL.table.field.defaultValue.invalid()}</Alert.Title>
      <Alert.Description>{$LL.table.field.defaultValue.invalidDescription()}</Alert.Description>
    </Alert.Root>
  {/if}
  {#if constraint}
    <div class="grid grid-cols-2 gap-2">
      <div class="space-y-1">
        <Label for="min" class="text-xs font-normal">{$LL.table.field.number.min()}</Label>
        <NumberInput
          {disabled}
          id="min"
          min={0}
          max={constraint.max}
          step={1}
          bind:value={constraint.min}
          placeholder={$LL.table.field.number.minPlaceholder()}
          class="bg-background text-xs"
        />
      </div>
      <div class="space-y-1">
        <Label for="max" class="text-xs font-normal">{$LL.table.field.number.max()}</Label>
        <NumberInput
          {disabled}
          id="max"
          min={constraint.min || 0}
          step={1}
          bind:value={constraint.max}
          placeholder={$LL.table.field.number.maxPlaceholder()}
          class="bg-background text-xs"
        />
      </div>
    </div>

    <div class="pt-2">
      <Separator />
    </div>
    <div class="flex items-center space-x-2">
      <Checkbox id="required" {disabled} bind:checked={constraint.required} />
      <Label for="required" class="text-xs font-normal">{$LL.table.field.defaultValue.markAsRequired()}</Label>
    </div>

    <div class="flex items-center space-x-2">
      <Checkbox id="display" {disabled} bind:checked={display} />
      <Label for="display" class="text-xs font-normal">{$LL.table.field.display.markAsDisplay()}</Label>
    </div>
  {/if}
</div>
