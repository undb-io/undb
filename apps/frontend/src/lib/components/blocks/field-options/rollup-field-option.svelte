<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import {
    FieldIdVo,
    ReferenceField,
    TableCreator,
    TableDo,
    getIsFieldCanBeRollup,
    type IRollupFieldOption,
  } from "@undb/table"
  import FieldPicker from "../field-picker/field-picker.svelte"
  import { GetForeignTableQueryStore } from "$houdini"
  import { writable } from "svelte/store"
  import RollupFnPicker from "../rollup/rollup-fn-picker.svelte"

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
  $: if (foreignTable) foreignTableDo.set(new TableCreator().fromJSON(foreignTable))
  $: schema = foreignTable?.schema

  $: fields = schema?.filter((f) => getIsFieldCanBeRollup(f.type))
</script>

<div class="space-y-2">
  <FieldPicker
    class="w-full"
    {...$$restProps}
    bind:value={option.referenceFieldId}
    filter={(f) => f.type === "reference"}
  />

  {#if $foreignTableDo && fields?.length}
    <FieldPicker
      class="w-full"
      {...$$restProps}
      bind:value={option.rollupFieldId}
      table={foreignTableDo}
      filter={(f) => fields.some((field) => field.id === f.id)}
    />
  {/if}

  {#if $foreignTableDo && option.rollupFieldId}
    <RollupFnPicker foreignTable={$foreignTableDo} rollupFieldId={option.rollupFieldId} bind:value={option.fn} />
  {/if}
</div>
