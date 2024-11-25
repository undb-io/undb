<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox"
  import NumberInput from "$lib/components/ui/input/number-input.svelte"
  import { Label } from "$lib/components/ui/label/index.js"
  import { Separator } from "$lib/components/ui/separator"
  import type { IRatingFieldConstraint } from "@undb/table"
  import { LL } from "@undb/i18n/client"

  export let constraint: IRatingFieldConstraint | undefined
  export let defaultValue: number | undefined
  export let disabled: boolean = false
</script>

<div class="space-y-2">
  <div class="space-y-1">
    <Label for="defaultValue" class="text-xs font-normal">{$LL.table.field.defaultValue.label()}</Label>
    <NumberInput
      id="defaultValue"
      class="bg-background flex-1 text-xs"
      placeholder={$LL.table.field.defaultValue.placeholder()}
      bind:value={defaultValue}
      max={constraint?.max}
      {disabled}
    />
  </div>
  {#if constraint}
    <div class="grid grid-cols-2 gap-2">
      <div class="space-y-1">
        <Label for="min" class="text-xs font-normal">{$LL.table.field.number.min()}</Label>
        <NumberInput
          id="min"
          min={0}
          max={constraint.max}
          step={1}
          bind:value={constraint.min}
          placeholder={$LL.table.field.number.minPlaceholder()}
          class="bg-background text-xs"
          {disabled}
        />
      </div>
      <div class="space-y-1">
        <Label for="max" class="text-xs font-normal">{$LL.table.field.number.max()}</Label>
        <NumberInput
          id="max"
          min={constraint.min || 0}
          step={1}
          bind:value={constraint.max}
          placeholder={$LL.table.field.number.maxPlaceholder()}
          class="bg-background text-xs"
          {disabled}
        />
      </div>
    </div>

    <div class="pt-2">
      <Separator />
    </div>
    <div class="flex items-center space-x-2">
      <Checkbox {disabled} id="required" bind:checked={constraint.required} />
      <Label for="required" class="text-xs font-normal">{$LL.table.field.defaultValue.markAsRequired()}</Label>
    </div>
  {/if}
</div>
