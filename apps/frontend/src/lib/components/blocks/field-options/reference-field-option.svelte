<script lang="ts">
  import type { ICreateReferenceFieldDTO, IReferenceFieldConstraint } from "@undb/table"
  import NumberInput from "$lib/components/ui/input/number-input.svelte"
  import { Label } from "$lib/components/ui/label/index.js"
  import ForeignTablePicker from "../reference/foreign-table-picker.svelte"
  import { ExternalLinkIcon } from "lucide-svelte"
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte"
  import { Separator } from "$lib/components/ui/separator"

  export let constraint: IReferenceFieldConstraint | undefined = {
    required: false,
  }
  export let option: Partial<ICreateReferenceFieldDTO["option"]> = {
    foreignTableId: undefined,
    createSymmetricField: true,
  }
  export let isNew: boolean
</script>

<div class="space-y-2">
  {#if option}
    <div class="space-y-1">
      <Label class="text-muted-foreground flex items-center text-xs font-normal">
        <ExternalLinkIcon class="mr-2 h-3 w-3" />
        Foreign table
      </Label>
      <ForeignTablePicker disabled={!isNew} bind:value={option.foreignTableId} class="text-xs" />
    </div>
  {/if}
  {#if isNew}
    <div class="flex items-center gap-2">
      <Checkbox id="createSymmetricField" bind:checked={option.createSymmetricField} />
      <Label for="createSymmetricField" class="text-xs font-normal">Create symmetric field</Label>
    </div>
  {/if}
  {#if constraint}
    <div class="grid grid-cols-2 gap-2">
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
    </div>

    <div class="pt-2">
      <Separator />
    </div>
    <div class="flex items-center space-x-2">
      <Checkbox id="required" bind:checked={constraint.required} />
      <Label for="required" class="text-xs font-normal">Mark as required field.</Label>
    </div>
  {/if}
</div>
