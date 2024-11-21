<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import {
    FieldIdVo,
    ReferenceField,
    TableFactory,
    TableDo,
    getIsFieldCanBeRollup,
    type IRollupFieldOption,
  } from "@undb/table"
  import FieldPicker from "../field-picker/field-picker.svelte"
  import { GetForeignTableQueryStore } from "$houdini"
  import { writable } from "svelte/store"
  import RollupFnPicker from "../rollup/rollup-fn-picker.svelte"
  import Label from "$lib/components/ui/label/label.svelte"
  import autoAnimate from "@formkit/auto-animate"

  export let disabled: boolean = false

  const table = getTable()

  export let option: Partial<IRollupFieldOption> = {
    fn: "sum",
  }

  $: field = (
    option.referenceFieldId ? $table.schema.getFieldById(new FieldIdVo(option.referenceFieldId)).unwrap() : undefined
  ) as ReferenceField | undefined
  $: foreignTableId = field?.foreignTableId

  const store = new GetForeignTableQueryStore()

  $: if (foreignTableId) store.fetch({ variables: { tableId: foreignTableId } })

  $: foreignTable = $store.data?.table
  const foreignTableDo = writable<TableDo>()
  $: if (foreignTable) foreignTableDo.set(new TableFactory().fromJSON(foreignTable))
  $: schema = foreignTable?.schema

  $: fields = schema?.filter((f) => getIsFieldCanBeRollup(f.type))
</script>

<div class="space-y-2">
  <div class="space-y-1">
    <Label class="text-xs font-normal">Reference field</Label>
    <FieldPicker
      placeholder="Select a reference field..."
      {disabled}
      class="w-full justify-start"
      {...$$restProps}
      value={option.referenceFieldId}
      onValueChange={(field) => {
        option.referenceFieldId = field
      }}
      filter={(f) => f.type === "reference"}
    />
  </div>

  <div class="space-y-2" use:autoAnimate>
    {#if $foreignTableDo && fields?.length}
      <div class="space-y-1">
        <Label class="text-xs font-normal">Foreign rollup field</Label>
        <FieldPicker
          class="w-full"
          {disabled}
          {...$$restProps}
          value={option.rollupFieldId}
          onValueChange={(field) => {
            option.rollupFieldId = field
          }}
          table={foreignTableDo}
          filter={(f) => fields.some((field) => field.id === f.id)}
        />
      </div>
    {/if}

    {#if $foreignTableDo && option.rollupFieldId}
      <div class="space-y-1">
        <Label class="text-xs font-normal">Aggregate function</Label>
        <RollupFnPicker
          {disabled}
          foreignTable={$foreignTableDo}
          rollupFieldId={option.rollupFieldId}
          value={option.fn}
          onValueChange={(fn) => {
            option.fn = fn
          }}
        />
      </div>
    {/if}
  </div>
</div>
