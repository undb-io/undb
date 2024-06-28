<script lang="ts">
  import NumberInput from "$lib/components/ui/input/number-input.svelte"
  import { Label } from "$lib/components/ui/label/index.js"
  import { Switch } from "$lib/components/ui/switch/index.js"
  import type { IAttachmentFieldConstraint } from "@undb/table"

  export let constraint: IAttachmentFieldConstraint | undefined
  let single = !constraint || constraint.max === 1

  $: if (constraint) {
    if (single) {
      constraint.max = 1
    } else {
      constraint.max = undefined
    }
  }
</script>

{#if constraint}
  <div class="space-y-4">
    <Label class="flex items-center gap-2 text-xs">
      <Switch bind:checked={single} />
      Single
    </Label>
    {#if !single}
      <div class="grid grid-cols-3 gap-3">
        <div class="grid gap-3">
          <Label for="max">Max</Label>
          <NumberInput id="max" step={1} bind:value={constraint.max} placeholder="max" class="bg-background" />
        </div>
      </div>
    {/if}
    <div class="mt-4 flex items-center gap-3">
      <div class="flex items-center space-x-2">
        <Switch id="required" bind:checked={constraint.required} />
        <Label for="required" class="text-xs">Required</Label>
      </div>
    </div>
  </div>
{/if}
