<script lang="ts">
  import type { IFieldConstraint, NoneSystemFieldType } from "@undb/table"
  import type { ComponentType } from "svelte"
  import StringFieldOption from "./string-field-option.svelte"
  import EmailFieldOption from "./email-field-option.svelte"
  import NumberFieldOption from "./number-field-option.svelte"
  import ReferenceFieldOption from "./reference-field-option.svelte"
  import RollupFieldOption from "./rollup-field-option.svelte"
  import SelectFieldOption from "./select-field-option.svelte"
  import RatingFieldOption from "./rating-field-option.svelte"
  import AttachmentFieldOption from "./attachment-field-option.svelte"
  import UserFieldOption from "./user-field-option.svelte"
  import CheckboxFieldOption from "./checkbox-field-option.svelte"

  export let constraint: IFieldConstraint | undefined
  export let option: any | undefined
  export let display: boolean | undefined
  export let defaultValue: any | undefined
  export let isNew = true

  const map: Partial<Record<NoneSystemFieldType, ComponentType>> = {
    string: StringFieldOption,
    number: NumberFieldOption,
    reference: ReferenceFieldOption,
    rollup: RollupFieldOption,
    select: SelectFieldOption,
    rating: RatingFieldOption,
    attachment: AttachmentFieldOption,
    user: UserFieldOption,
    email: EmailFieldOption,
    checkbox: CheckboxFieldOption,
  }

  export let type: NoneSystemFieldType
</script>

<svelte:component this={map[type]} bind:constraint bind:display bind:defaultValue bind:option {isNew} />
