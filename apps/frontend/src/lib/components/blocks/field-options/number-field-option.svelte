<script lang="ts">
  import NumberInput from "$lib/components/ui/input/number-input.svelte"
  import { Label } from "$lib/components/ui/label/index.js"
  import { Switch } from "$lib/components/ui/switch/index.js"
  import type { INumberFieldConstraint } from "@undb/table"

  export let constraint: INumberFieldConstraint | undefined
  export let display: boolean | undefined
  export let defaultValue: number | undefined
</script>

{#if constraint}
  <div class="space-y-4">
    <div class="flex items-center gap-1">
      <Label for="defaultValue">Default</Label>
      <NumberInput class="bg-background flex-1" bind:value={defaultValue} />
    </div>
    <div class="grid grid-cols-3 gap-2">
      <div class="col-span-1 flex items-center gap-1.5">
        <Label for="min">Min</Label>
        <NumberInput
          min={0}
          max={constraint.max}
          step={1}
          bind:value={constraint.min}
          placeholder="min"
          class="bg-background"
        />
      </div>
      <div class="col-span-1 flex items-center gap-1.5">
        <Label for="max">Max</Label>
        <NumberInput
          min={constraint.min || 0}
          step={1}
          bind:value={constraint.max}
          placeholder="max"
          class="bg-background"
        />
      </div>
      <div class="col-span-1 flex items-center gap-1.5">
        <Switch id="isInt" bind:checked={constraint.isInt} />
        <Label for="isInt">Is Int</Label>
      </div>
    </div>
    <div class="mt-4 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <Switch id="required" bind:checked={constraint.required} />
        <Label for="required">Required</Label>
      </div>
      <div class="flex items-center space-x-2">
        <Switch id="display" bind:checked={display} />
        <Label for="display">Display</Label>
      </div>
    </div>
  </div>
{/if}
