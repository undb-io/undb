<script lang="ts">
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte"
  import Input from "$lib/components/ui/input/input.svelte"
  import { Label } from "$lib/components/ui/label/index.js"
  import Separator from "$lib/components/ui/separator/separator.svelte"
  import * as Alert from "$lib/components/ui/alert/index.js"
  import { LL } from "@undb/i18n/client"

  import { StringFieldConstraint, type ILongTextFieldConstraint, type ILongTextFieldOption } from "@undb/table"

  export let constraint: ILongTextFieldConstraint | undefined
  export let option: ILongTextFieldOption = {
    allowRichText: true,
  }
  export let disabled = false
  export let defaultValue: string | undefined

  $: c = constraint ? new StringFieldConstraint(constraint) : undefined
  $: isDefaultValueValid = c && defaultValue ? c.schema.safeParse(defaultValue).success : true
</script>

<div class="space-y-2">
  <div class="space-y-1">
    <Label for="defaultValue" class="text-xs font-normal">{$LL.table.field.defaultValue.label()}</Label>
    <Input
      {disabled}
      id="defaultValue"
      class="bg-background flex-1 text-xs"
      placeholder={$LL.table.field.defaultValue.placeholder()}
      bind:value={defaultValue}
    />
  </div>
  {#if !isDefaultValueValid}
    <Alert.Root class="mt-2 border-yellow-500 bg-yellow-50">
      <Alert.Title>{$LL.table.field.defaultValue.invalid()}</Alert.Title>
      <Alert.Description>{$LL.table.field.defaultValue.invalidDescription()}</Alert.Description>
    </Alert.Root>
  {/if}
  <div class="pt-2">
    <Separator />
  </div>

  {#if option}
    <div class="flex items-center space-x-2">
      <Checkbox id="allowRichText" {disabled} bind:checked={option.allowRichText} />
      <Label for="allowRichText" class="text-xs font-normal">{$LL.table.field.longText.allowRichText()}</Label>
    </div>
  {/if}

  {#if constraint}
    <div class="flex items-center space-x-2">
      <Checkbox id="required" {disabled} bind:checked={constraint.required} />
      <Label for="required" class="text-xs font-normal">{$LL.table.field.defaultValue.markAsRequired()}</Label>
    </div>
  {/if}
</div>
