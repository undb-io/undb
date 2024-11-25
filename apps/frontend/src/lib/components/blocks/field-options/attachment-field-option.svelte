<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox"
  import NumberInput from "$lib/components/ui/input/number-input.svelte"
  import { Label } from "$lib/components/ui/label/index.js"
  import { Separator } from "$lib/components/ui/separator"
  import { Switch } from "$lib/components/ui/switch/index.js"
  import autoAnimate from "@formkit/auto-animate"
  import type { IAttachmentFieldConstraint } from "@undb/table"
  import { LL } from "@undb/i18n/client"

  export let constraint: IAttachmentFieldConstraint | undefined
  export let disabled: boolean = false
</script>

{#if constraint}
  <div class="grid grid-cols-2 gap-2" use:autoAnimate>
    <div class="space-y-1">
      <Label for="min" class="text-xs font-normal">{$LL.table.field.attachment.min()}</Label>
      <NumberInput
        id="min"
        min={0}
        max={constraint.max}
        step={1}
        bind:value={constraint.min}
        placeholder={$LL.table.field.attachment.minPlaceholder()}
        class="bg-background text-xs"
        {disabled}
      />
    </div>
    <div class="space-y-1">
      <Label for="max" class="text-xs font-normal">{$LL.table.field.attachment.max()}</Label>
      <NumberInput
        id="max"
        min={constraint.min || 0}
        step={1}
        bind:value={constraint.max}
        placeholder={$LL.table.field.attachment.maxPlaceholder()}
        class="bg-background text-xs"
        {disabled}
      />
    </div>
  </div>

  <div class="pb-2">
    <Separator />
  </div>
  <div class="flex items-center space-x-2">
    <Checkbox {disabled} id="required" bind:checked={constraint.required} />
    <Label for="required" class="text-xs font-normal">{$LL.table.field.defaultValue.markAsRequired()}</Label>
  </div>
{/if}
