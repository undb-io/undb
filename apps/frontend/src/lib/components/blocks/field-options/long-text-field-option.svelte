<script lang="ts">
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte"
  import Input from "$lib/components/ui/input/input.svelte"
  import { Label } from "$lib/components/ui/label/index.js"
  import Separator from "$lib/components/ui/separator/separator.svelte"
  import * as Alert from "$lib/components/ui/alert/index.js"

  import { StringFieldConstraint, type ILongTextFieldConstraint, type ILongTextFieldOption } from "@undb/table"

  export let constraint: ILongTextFieldConstraint | undefined
  export let option: ILongTextFieldOption = {
    allowRichText: true,
  }
  export let defaultValue: string | undefined

  $: c = constraint ? new StringFieldConstraint(constraint) : undefined
  $: isDefaultValueValid = c && defaultValue ? c.schema.safeParse(defaultValue).success : true
</script>

<div class="space-y-2">
  <div class="space-y-1">
    <Label for="defaultValue" class="text-xs font-normal">Default value</Label>
    <Input
      id="defaultValue"
      class="bg-background flex-1 text-xs"
      placeholder="Default value..."
      bind:value={defaultValue}
    />
  </div>
  {#if !isDefaultValueValid}
    <Alert.Root class="mt-2 border-yellow-500 bg-yellow-50">
      <Alert.Title>Invalid default value</Alert.Title>
      <Alert.Description>Your default value is invalid. Default value will not be saved.</Alert.Description>
    </Alert.Root>
  {/if}
  <div class="pt-2">
    <Separator />
  </div>

  {#if option}
    <div class="flex items-center space-x-2">
      <Checkbox id="allowRichText" bind:checked={option.allowRichText} />
      <Label for="allowRichText" class="text-xs font-normal">Allow rich text.</Label>
    </div>
  {/if}

  {#if constraint}
    <div class="flex items-center space-x-2">
      <Checkbox id="required" bind:checked={constraint.required} />
      <Label for="required" class="text-xs font-normal">Mark as required field.</Label>
    </div>
  {/if}
</div>
