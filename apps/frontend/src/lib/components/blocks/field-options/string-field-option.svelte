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

<div class="space-y-4">
  <div class="grid gap-3">
    <Label for="defaultValue">Default</Label>
    <Input id="defaultValue" class="bg-background flex-1" placeholder="default value" bind:value={defaultValue} />
  </div>
  {#if constraint}
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

      <div class="flex items-center space-x-2">
        <Switch id="display" bind:checked={display} />
        <Label for="display" class="text-xs">Display</Label>
      </div>
    </div>
  {/if}
</div>
