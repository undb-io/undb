<script lang="ts">
  import NumberInput from "$lib/components/ui/input/number-input.svelte"
  import { Label } from "$lib/components/ui/label/index.js"
  import { Switch } from "$lib/components/ui/switch/index.js"
  import type { IAttachmentFieldConstraint } from "@undb/table"
  import * as Select from "$lib/components/ui/select"

  export let constraint: IAttachmentFieldConstraint | undefined

  $: if (constraint) {
    if (single) {
      constraint.max = 1
    } else {
      constraint.max = undefined
    }
  }

  let single = "single"
  $: isSingle = "single" === single

  $: if (constraint) {
    if (isSingle) {
      constraint.max = 1
    } else {
      constraint.max = undefined
    }
  }

  $: selected = isSingle
    ? {
        label: "Single",
        value: "single",
      }
    : {
        label: "Multiple",
        value: "multiple",
      }
</script>

{#if constraint}
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <Select.Root
        {selected}
        onSelectedChange={(selected) => {
          if (selected) {
            single = selected.value
          }
        }}
      >
        <Select.Trigger class="w-[140px]">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="single">Single</Select.Item>
          <Select.Item value="multiple">Multiple</Select.Item>
        </Select.Content>
      </Select.Root>

      {#if !isSingle}
        <Label class="flex flex-1 items-center gap-2">
          Max
          <NumberInput bind:value={constraint.max} />
        </Label>
      {/if}
    </div>
    <div class="mt-4 flex items-center gap-3">
      <div class="flex items-center space-x-2">
        <Switch id="required" bind:checked={constraint.required} />
        <Label for="required" class="text-xs">Required</Label>
      </div>
    </div>
  </div>
{/if}
