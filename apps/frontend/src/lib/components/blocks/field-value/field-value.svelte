<script lang="ts">
  import type { Field, FieldType } from "@undb/table"
  import type { ComponentType } from "svelte"
  import StringField from "./string-field.svelte"
  import NumberField from "./number-field.svelte"
  import DateField from "./date-field.svelte"
  import IdField from "./id-field.svelte"
  import UserField from "./user-field.svelte"
  import RollupField from "./rollup-field.svelte"
  import ReferenceField from "./reference-field.svelte"
  import SelectField from "./select-field.svelte"
  import RatingField from "./rating-field.svelte"
  import AttachmentField from "./attachment-field.svelte"
  import JsonField from "./json-field.svelte"

  export let type: FieldType
  export let value: any
  export let displayValue: any
  export let field: Field

  const map: Record<FieldType, ComponentType> = {
    id: IdField,
    string: StringField,
    number: NumberField,
    createdAt: DateField,
    updatedAt: DateField,
    autoIncrement: NumberField,
    createdBy: UserField,
    updatedBy: UserField,
    reference: ReferenceField,
    rollup: RollupField,
    select: SelectField,
    rating: RatingField,
    email: StringField,
    attachment: AttachmentField,
    json: JsonField,
  }
</script>

<svelte:component this={map[type]} {...$$restProps} {field} {value} {displayValue} />
