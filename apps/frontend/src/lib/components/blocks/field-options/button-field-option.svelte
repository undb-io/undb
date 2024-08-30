<script lang="ts">
  import FieldPicker from "../field-picker/field-picker.svelte"
  import {
    FieldIdVo,
    getIsFilterableFieldType,
    getIsMutableFieldType,
    type IButtonFieldOption,
    type MaybeConditionGroup,
    parseValidViewFilter,
    toMaybeConditionGroup,
  } from "@undb/table"
  import { getTable } from "$lib/store/table.store"
  import FieldControl from "../field-control/field-control.svelte"
  import { Input } from "$lib/components/ui/input"
  import { Label } from "$lib/components/ui/label"
  import { Checkbox } from "$lib/components/ui/checkbox"
  import { Button } from "$lib/components/ui/button"
  import Separator from "$lib/components/ui/separator/separator.svelte"
  import { writable } from "svelte/store"
  import type { ZodUndefined } from "@undb/zod"
  import FiltersEditor from "../filters-editor/filters-editor.svelte"
  import { onMount } from "svelte"

  const table = getTable()

  $: visibleFields = $table.getOrderedVisibleFields()

  export let disabled: boolean | undefined
  export let option: IButtonFieldOption = {
    label: undefined,
    disabled: undefined,
    action: {
      type: "update",
      values: [
        {
          field: undefined,
          value: undefined,
        },
      ],
      confirm: true,
    },
  }
  const value = writable<MaybeConditionGroup<ZodUndefined> | undefined>()
  $: validValue = $value ? parseValidViewFilter($table.schema, $value) : undefined
  $: if (validValue) {
    option.disabled = validValue
  }

  onMount(() => {
    if (option.disabled) {
      value.set(toMaybeConditionGroup(option.disabled))
    }
  })

  $: selectedFields = option.action.values.map((v) => v.field)
  $: selectableFields = $table.schema.fields.filter(
    (f) => getIsMutableFieldType(f.type) && f.type !== "attachment" && !selectedFields.includes(f.id.value),
  )
</script>

<div class="space-y-2">
  <Label for="label">Label</Label>
  <Input class="w-full" placeholder="Button" id="label" bind:value={option.label} />

  <div class="space-y-2 rounded-sm border pt-2">
    <Label class="pl-4 text-xs font-semibold" for="disabled">Disabled When...</Label>
    <FiltersEditor
      bind:value={$value}
      table={$table}
      filter={(field) => visibleFields.some((f) => f.id.value === field.id) && getIsFilterableFieldType(field.type)}
    ></FiltersEditor>
  </div>

  <p class="text-xs font-semibold">Update Value when Click Button</p>
  {#each option.action.values as value, index}
    {@const field = value.field ? $table.schema.getFieldById(new FieldIdVo(value.field)).unwrap() : undefined}
    <FieldPicker
      class="w-full"
      bind:value={value.field}
      {disabled}
      filter={(f) =>
        getIsMutableFieldType(f.type) && f.type !== "attachment" && !option.action.values.some((v) => v.field === f.id)}
    />
    {#if field}
      <FieldControl
        class="text-xs"
        placeholder="Value to update..."
        bind:value={value.value}
        {field}
        tableId={$table.id.value}
      />
    {/if}
    {#if index !== option.action.values.length - 1}
      <Separator />
    {/if}
  {/each}
  {#if selectableFields.length > 0 && option.action.values.every((v) => v.field)}
    <Button
      class="text-muted-foreground w-full text-xs"
      on:click={() => {
        option.action.values = [...option.action.values, { field: undefined, value: undefined }]
      }}
      variant="link"
      size="sm">+ Add another field to update</Button
    >
  {/if}

  <div class="flex items-center gap-2">
    <Checkbox id="confirm" bind:checked={option.action.confirm} />
    <Label class="text-xs font-normal" for="confirm">Confirm before update</Label>
  </div>
</div>
