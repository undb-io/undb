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
  import { Switch } from "$lib/components/ui/switch"
  import FiltersEditor from "../filters-editor/filters-editor.svelte"
  import { onMount, tick } from "svelte"
  import { LL } from "@undb/i18n/client"

  const table = getTable()

  $: visibleFields = $table?.getOrderedVisibleFields() ?? []

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
  onMount(() => {
    if (!option.action) {
      option.action = {
        type: "update",
        values: [
          {
            field: undefined,
            value: undefined,
          },
        ],
        confirm: true,
      }
    }
  })
  const value = writable<MaybeConditionGroup<any> | undefined>()
  $: validValue = $table && $value ? parseValidViewFilter($table.schema, $value) : undefined
  $: if (validValue) {
    option.disabled = validValue
  }

  let disabledWhen = false

  onMount(() => {
    if (option.disabled) {
      value.set(toMaybeConditionGroup(option.disabled))
      disabledWhen = true
    }
  })

  $: selectedFields = option.action?.values.map((v) => v.field) ?? []
  $: selectableFields =
    $table?.schema.fields.filter(
      (f) => getIsMutableFieldType(f.type) && f.type !== "attachment" && !selectedFields.includes(f.id.value),
    ) ?? []
</script>

<div class="space-y-2">
  <Label for="label">{$LL.table.field.button.label()}</Label>
  <Input class="w-full" placeholder="Button" id="label" bind:value={option.label} />

  <Label class="flex items-center gap-2 text-xs font-semibold" for="disabled">
    <Switch id="disabled" bind:checked={disabledWhen} size="sm" />
    {$LL.table.field.button.disabledWhen()}
  </Label>
  {#if disabledWhen}
    <div class="space-y-2 rounded-sm border pt-2">
      <FiltersEditor
        bind:value={$value}
        table={$table}
        filter={(field) => visibleFields.some((f) => f.id.value === field.id) && getIsFilterableFieldType(field.type)}
      ></FiltersEditor>
    </div>
  {/if}

  <div class="space-y-2 rounded-md border px-4 py-3">
    <p class="text-xs font-semibold">{$LL.table.field.button.updateValueWhenClickButton()}</p>
    {#each option.action?.values as value, index}
      {@const field =
        value.field && $table ? $table.schema.getFieldById(new FieldIdVo(value.field)).unwrap() : undefined}
      <FieldPicker
        class="w-full"
        value={value.field}
        onValueChange={async (field) => {
          value.field = field
          value.value = undefined
          option = option
          await tick()
        }}
        {disabled}
        filter={(f) =>
          getIsMutableFieldType(f.type) &&
          f.type !== "attachment" &&
          !option.action.values.some((v) => v.field === f.id)}
      />
      {#if field}
        <FieldControl
          class="text-xs"
          placeholder={$LL.table.field.button.valueToUpdate()}
          value={value.value}
          onValueChange={async (v) => {
            value.value = v
            option = option
            await tick()
          }}
          {field}
          tableId={$table?.id.value}
        />
      {/if}
      {#if index !== (option.action?.values?.length ?? 0) - 1}
        <Separator />
      {/if}
    {/each}
    {#if selectableFields.length > 0 && (option.action?.values?.every((v) => v.field) ?? false)}
      <Button
        class="text-muted-foreground w-full justify-start text-xs"
        on:click={() => {
          if (!option.action) {
            option.action = {
              type: "update",
              values: [],
              confirm: true,
            }
          } else {
            option.action.values = [...(option.action?.values ?? []), { field: undefined, value: undefined }]
          }
        }}
        variant="link"
        size="sm">{$LL.table.field.button.addAnotherFieldToUpdate()}</Button
      >
    {/if}
  </div>

  <div class="flex items-center gap-2">
    {#if option.action}
      <Checkbox id="confirm" bind:checked={option.action.confirm} />
      <Label class="text-xs font-normal" for="confirm">{$LL.table.field.button.confirmBeforeUpdate()}</Label>
    {/if}
  </div>
</div>
