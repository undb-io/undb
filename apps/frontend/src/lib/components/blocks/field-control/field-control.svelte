<script lang="ts">
  import type { Field, FieldType } from "@undb/table"
  import IdControl from "./id-control.svelte"
  import StringControl from "./string-control.svelte"
  import NumberControl from "./number-control.svelte"
  import type { ComponentType } from "svelte"
  import DateControl from "./date-control.svelte"
  import UserControl from "./user-control.svelte"
  import ReferenceControl from "./reference-control.svelte"
  import RollupControl from "./rollup-control.svelte"

  export let field: Field

  export let value: any

  function handleValue() {
    const { success } = field.valueSchema.safeParse(value)
    if (!success) {
      value = undefined
    }
  }

  $: field, handleValue()

  const map: Record<FieldType, ComponentType> = {
    id: IdControl,
    string: StringControl,
    number: NumberControl,
    autoIncrement: NumberControl,
    createdAt: DateControl,
    updatedAt: DateControl,
    createdBy: UserControl,
    updatedBy: UserControl,
    reference: ReferenceControl,
    rollup: RollupControl,
  }
</script>

<svelte:component this={map[field.type]} on:change {...$$restProps} bind:value {field} />
