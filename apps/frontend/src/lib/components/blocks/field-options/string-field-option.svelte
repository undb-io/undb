<script lang="ts">
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte"
  import Input from "$lib/components/ui/input/input.svelte"
  import NumberInput from "$lib/components/ui/input/number-input.svelte"
  import { Label } from "$lib/components/ui/label/index.js"
  import Separator from "$lib/components/ui/separator/separator.svelte"
  import * as Alert from "$lib/components/ui/alert/index.js"
  import { LL } from "@undb/i18n/client"

  import { StringFieldConstraint, type IStringFieldConstraint } from "@undb/table"

  export let constraint: IStringFieldConstraint | undefined
  export let display: boolean | undefined
  export let defaultValue: string | undefined
  export let disabled = false

  $: c = constraint ? new StringFieldConstraint(constraint) : undefined
  $: isDefaultValueValid = c && defaultValue ? c.schema.safeParse(defaultValue).success : true
</script>

<div class="space-y-2">
  <div class="space-y-1">
    <Label for="defaultValue" class="text-xs font-normal">{$LL.table.field.defaultValue.label()}</Label>
    <Input
      {disabled}
      id="defaultValue"
      class="bg-background flex-1 text-xs"
      placeholder={$LL.table.field.defaultValue.placeholder()}
      bind:value={defaultValue}
    />
  </div>
  {#if !isDefaultValueValid}
    <Alert.Root class="mt-2 border-yellow-500 bg-yellow-50">
      <Alert.Title>{$LL.table.field.defaultValue.invalid()}</Alert.Title>
      <Alert.Description>{$LL.table.field.defaultValue.invalidDescription()}</Alert.Description>
    </Alert.Root>
  {/if}
  {#if constraint}
    <div class="grid grid-cols-2 gap-2">
      <div class="space-y-1">
        <Label for="min" class="text-xs font-normal">{$LL.table.field.string.min()}</Label>
        <NumberInput
          {disabled}
          id="min"
          min={0}
          max={constraint.max}
          step={1}
          bind:value={constraint.min}
          placeholder={$LL.table.field.string.min()}
          class="bg-background text-xs"
        />
      </div>
      <div class="space-y-1">
        <Label for="max" class="text-xs font-normal">{$LL.table.field.string.max()}</Label>
        <NumberInput
          {disabled}
          id="max"
          min={constraint.min || 0}
          step={1}
          bind:value={constraint.max}
          placeholder={$LL.table.field.string.max()}
          class="bg-background text-xs"
        />
      </div>
    </div>

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
