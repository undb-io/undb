<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte"
  import NumberInput from "$lib/components/ui/input/number-input.svelte"
  import { Label } from "$lib/components/ui/label/index.js"
  import { Switch } from "$lib/components/ui/switch/index.js"

  import type { IStringFieldConstraint } from "@undb/table"

  export let constraint: IStringFieldConstraint | undefined
  export let display: boolean | undefined
  export let defaultValue: string | undefined
</script>

{#if constraint}
  <div class="space-y-4">
    <div class="flex items-center gap-1">
      <Label for="defaultValue">Default</Label>
      <Input class="bg-background flex-1" bind:value={defaultValue} />
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
    </div>
    <div class="flex items-center justify-between">
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
