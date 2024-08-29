<script lang="ts">
  import FieldPicker from "../field-picker/field-picker.svelte"
  import { FieldIdVo, getIsMutableFieldType, type IButtonFieldOption } from "@undb/table"
  import { getTable } from "$lib/store/table.store"
  import FieldControl from "../field-control/field-control.svelte"
  import autoAnimate from "@formkit/auto-animate"
  import { Input } from "$lib/components/ui/input"
  import { Label } from "$lib/components/ui/label"
  import { Checkbox } from "$lib/components/ui/checkbox"

  const table = getTable()

  export let disabled: boolean | undefined
  export let option: IButtonFieldOption = {
    label: undefined,
    action: {
      type: "update",
      field: undefined,
      value: undefined,
      confirm: true,
    },
  }

  $: field = option.action.field ? $table.schema.getFieldById(new FieldIdVo(option.action.field)).unwrap() : undefined
</script>

<div class="space-y-2">
  <Label for="label">Label</Label>
  <Input class="w-full" placeholder="Button" id="label" bind:value={option.label} />

  <p class="text-xs font-semibold">Update Value when Click Button</p>
  <FieldPicker
    class="w-full"
    bind:value={option.action.field}
    {disabled}
    filter={(f) => getIsMutableFieldType(f.type) && f.type !== "attachment"}
  />
  {#if field}
    <div use:autoAnimate>
      <FieldControl bind:value={option.action.value} {field} tableId={$table.id.value} />
    </div>
  {/if}
  <div class="flex items-center gap-2">
    <Checkbox id="confirm" bind:checked={option.action.confirm} />
    <Label class="text-xs font-normal" for="confirm">Confirm before update</Label>
  </div>
</div>
