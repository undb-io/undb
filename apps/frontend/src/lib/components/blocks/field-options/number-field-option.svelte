<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox"
  import NumberInput from "$lib/components/ui/input/number-input.svelte"
  import { Label } from "$lib/components/ui/label/index.js"
  import { Separator } from "$lib/components/ui/separator"
  import { NumberFieldConstraint, type INumberFieldConstraint } from "@undb/table"
  import * as Alert from "$lib/components/ui/alert/index.js"

  export let constraint: INumberFieldConstraint | undefined
  export let display: boolean | undefined
  export let defaultValue: number | undefined

  $: c = constraint ? new NumberFieldConstraint(constraint) : undefined
  $: isDefaultValueValid = c && defaultValue ? c.schema.safeParse(defaultValue).success : true
</script>

<div class="space-y-2">
  <div class="space-y-1">
    <Label for="defaultValue" class="text-xs font-normal">Default value</Label>
    <NumberInput
      id="defaultValue"
      class="bg-background flex-1 text-xs"
      placeholder="Default value..."
      bind:value={defaultValue}
    />
  </div>

  {#if !isDefaultValueValid}
    <Alert.Root class="border-yellow-500 bg-yellow-50">
      <Alert.Title>Invalid default value</Alert.Title>
      <Alert.Description>Your default value is invalid. Default value will not be saved.</Alert.Description>
    </Alert.Root>
  {/if}
  {#if constraint}
    <div class="grid grid-cols-2 gap-2">
      <div class="space-y-1">
        <Label for="min" class="text-xs font-normal">Min</Label>
        <NumberInput
          id="min"
          min={0}
          max={constraint.max}
          step={1}
          bind:value={constraint.min}
          placeholder="Min value..."
          class="bg-background text-xs"
        />
      </div>
      <div class="space-y-1">
        <Label for="max" class="text-xs font-normal">Max</Label>
        <NumberInput
          id="max"
          min={constraint.min || 0}
          step={1}
          bind:value={constraint.max}
          placeholder="Max value..."
          class="bg-background text-xs"
        />
      </div>
    </div>

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
