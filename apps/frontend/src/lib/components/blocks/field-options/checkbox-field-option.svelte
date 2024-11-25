<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte"
  import { Label } from "$lib/components/ui/label/index.js"
  import { LL } from "@undb/i18n/client"

  export let defaultValue: boolean | undefined = false
  export let disabled: boolean | undefined
</script>

<div class="space-y-1">
  <Label for="defaultValue" class="block text-xs font-normal">{$LL.table.field.defaultValue.label()}</Label>
  <Button
    variant="outline"
    class="flex w-full justify-start"
    {disabled}
    on:click={() => {
      defaultValue = !defaultValue
    }}
  >
    <Checkbox
      {disabled}
      checked={defaultValue}
      id="defaultValue"
      class="bg-background"
      placeholder={$LL.table.field.defaultValue.placeholder()}
    />
  </Button>
</div>
