<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox"
  import Input from "$lib/components/ui/input/input.svelte"
  import { Label } from "$lib/components/ui/label/index.js"
  import { Separator } from "$lib/components/ui/separator"
  import * as Alert from "$lib/components/ui/alert/index.js"
  import { UrlFieldConstraint, type IUrlFieldConstraint } from "@undb/table"
  import { LL } from "@undb/i18n/client"

  export let constraint: IUrlFieldConstraint | undefined
  export let display: boolean | undefined
  export let defaultValue: string | undefined
  export let disabled: boolean | undefined

  $: c = constraint ? new UrlFieldConstraint(constraint) : undefined
  $: isDefaultValueValid = c && defaultValue ? c.schema.safeParse(defaultValue).success : true
</script>

<div class="space-y-2">
  <div class="space-y-1">
    <Label for="defaultValue" class="text-xs font-normal">{$LL.table.field.defaultValue.label()}</Label>
    <Input
      id="defaultValue"
      type="url"
      class="bg-background flex-1 text-xs"
      placeholder={$LL.table.field.defaultValue.placeholder()}
      bind:value={defaultValue}
      {disabled}
    />
  </div>

  {#if !isDefaultValueValid}
    <Alert.Root class="border-yellow-500 bg-yellow-50">
      <Alert.Title>{$LL.table.field.defaultValue.invalid()}</Alert.Title>
      <Alert.Description>{$LL.table.field.defaultValue.invalidDescription()}</Alert.Description>
    </Alert.Root>
  {/if}
  {#if constraint}
    <div class="pt-2">
      <Separator />
    </div>

    <div class="flex items-center space-x-2">
      <Checkbox id="required" bind:checked={constraint.required} {disabled} />
      <Label for="required" class="text-xs font-normal">{$LL.table.field.defaultValue.markAsRequired()}</Label>
    </div>

    <div class="flex items-center space-x-2">
      <Checkbox id="display" bind:checked={display} {disabled} />
      <Label for="display" class="text-xs font-normal">{$LL.table.field.display.label()}</Label>
    </div>
  {/if}
</div>
