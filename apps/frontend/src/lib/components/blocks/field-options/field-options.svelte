<script lang="ts">
  import type { IFieldConstraint, NoneSystemFieldType } from "@undb/table"
  import type { ComponentType } from "svelte"
  import StringFieldOption from "./string-field-option.svelte"
  import NumberFieldOption from "./number-field-option.svelte"
  import ReferenceFieldOption from "./reference-field-option.svelte"

  export let constraint: IFieldConstraint | undefined
  export let option: any | undefined
  export let display: boolean | undefined
  export let defaultValue: any | undefined

  const map: Record<NoneSystemFieldType, ComponentType> = {
    string: StringFieldOption,
    number: NumberFieldOption,
    reference: ReferenceFieldOption,
  }

  export let type: NoneSystemFieldType
</script>

<svelte:component this={map[type]} bind:constraint bind:display bind:defaultValue bind:option />
