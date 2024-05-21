<script lang="ts">
  import NumberInput from "$lib/components/ui/input/number-input.svelte"
  import { Label } from "$lib/components/ui/label/index.js"
  import { Switch } from "$lib/components/ui/switch/index.js"

  import type { IStringFieldConstraint } from "@undb/table"

  export let constraint: IStringFieldConstraint | undefined
</script>

{#if constraint}
  <div class="grid grid-cols-3 gap-2">
    <div class="col-span-1 flex items-center gap-1.5">
      <Label for="min">Min</Label>
      <NumberInput min={0} max={constraint.max} step={1} bind:value={constraint.min} placeholder="min" />
    </div>
    <div class="col-span-1 flex items-center gap-1.5">
      <Label for="max">Max</Label>
      <NumberInput min={constraint.min || 0} step={1} bind:value={constraint.max} placeholder="max" />
    </div>
  </div>
  <div class="mt-2">
    <div class="flex items-center space-x-2">
      <Label for="required">Required</Label>
      <Switch id="required" bind:checked={constraint.required} />
    </div>
  </div>
{/if}
