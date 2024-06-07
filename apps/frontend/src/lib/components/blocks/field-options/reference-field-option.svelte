<script lang="ts">
  import type { ICreateReferenceFieldDTO, IReferenceFieldConstraint } from "@undb/table"
  import NumberInput from "$lib/components/ui/input/number-input.svelte"
  import { Label } from "$lib/components/ui/label/index.js"
  import { Switch } from "$lib/components/ui/switch/index.js"
  import ForeignTablePicker from "../reference/foreign-table-picker.svelte"

  export let constraint: IReferenceFieldConstraint | undefined
  export let option: Partial<ICreateReferenceFieldDTO["option"]> = {}
  export let isNew: boolean
</script>

{#if constraint}
  <div class="space-y-4">
    <div class="space-y-2">
      <Label>Foreign Table</Label>
      <ForeignTablePicker bind:value={option.foreignTableId} />
    </div>
    {#if isNew}
      <div class="flex items-center space-x-2">
        <Switch id="createSymmetricField" bind:checked={option.createSymmetricField} />
        <Label for="createSymmetricField" class="text-xs">create symmetric field</Label>
      </div>
    {/if}
    <div class="grid grid-cols-2 gap-3">
      <div class="grid gap-3">
        <Label for="min">Min</Label>
        <NumberInput
          id="min"
          min={0}
          max={constraint.max}
          step={1}
          bind:value={constraint.min}
          placeholder="min"
          class="bg-background"
        />
      </div>
      <div class="grid gap-3">
        <Label for="max">Max</Label>
        <NumberInput
          id="max"
          min={constraint.min || 0}
          step={1}
          bind:value={constraint.max}
          placeholder="max"
          class="bg-background"
        />
      </div>
    </div>
    <div class="flex items-center justify-end gap-3">
      <div class="flex items-center space-x-2">
        <Switch id="required" bind:checked={constraint.required} />
        <Label for="required" class="text-xs">Required</Label>
      </div>
    </div>
  </div>
{/if}
