<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js"
  import NumberInput from "$lib/components/ui/input/number-input.svelte"
  import { Switch } from "$lib/components/ui/switch/index.js"
  import { type IUserFieldConstraint } from "@undb/table"
  import autoAnimate from "@formkit/auto-animate"
  import { Separator } from "$lib/components/ui/separator"
  import { Checkbox } from "$lib/components/ui/checkbox"

  export let constraint: IUserFieldConstraint | undefined

  let multiple = false
</script>

{#if constraint}
  <div class="space-y-2 pt-2">
    <div class="flex items-center gap-2">
      <Switch
        id="single"
        bind:checked={multiple}
        onCheckedChange={(multiple) => {
          if (!multiple) {
            constraint.max = 1
          } else {
            constraint.max = undefined
          }
        }}
      />
      <Label for="single" class="text-xs font-normal">Allow adding multiple options</Label>
    </div>

    <div class="grid grid-cols-2 gap-2" use:autoAnimate>
      {#if multiple}
        <div class="space-y-1">
          <Label for="min" class="text-xs font-normal">Min items</Label>
          <NumberInput
            id="min"
            min={0}
            max={constraint.max}
            step={1}
            bind:value={constraint.min}
            placeholder="Min items..."
            class="bg-background text-xs"
          />
        </div>
        <div class="space-y-1">
          <Label for="max" class="text-xs font-normal">Max items</Label>
          <NumberInput
            id="max"
            min={constraint.min || 0}
            step={1}
            bind:value={constraint.max}
            placeholder="Max items..."
            class="bg-background text-xs"
          />
        </div>
      {/if}
    </div>

    <div class="pb-2">
      <Separator />
    </div>
    <div class="flex items-center space-x-2">
      <Checkbox id="required" bind:checked={constraint.required} />
      <Label for="required" class="text-xs font-normal">Mark as required field.</Label>
    </div>
  </div>
{/if}
