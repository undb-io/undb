<script lang="ts">
  import type { FieldType } from "@undb/table"
  import type { ComponentType } from "svelte"
  import StringField from "./string-field.svelte"
  import NumberField from "./number-field.svelte"
  import DateField from "./date-field.svelte"
  import IdField from "./id-field.svelte"

  export let type: FieldType
  export let value: any

  const map: Record<FieldType, ComponentType> = {
    id: IdField,
    string: StringField,
    number: NumberField,
    createdAt: DateField,
    updatedAt: DateField,
    autoIncrement: NumberField,
  }
</script>

<svelte:component this={map[type]} {...$$restProps} {value} />
