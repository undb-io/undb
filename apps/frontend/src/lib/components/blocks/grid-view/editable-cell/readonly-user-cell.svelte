<script lang="ts">
  import { CreatedByField, UpdatedByField, type ISingleUserFieldValue, type IUserFieldDisplayValue } from "@undb/table"
  import UserFieldComponent from "$lib/components/blocks/field-value/user-field.svelte"

  export let tableId: string
  export let field: CreatedByField | UpdatedByField
  export let value: ISingleUserFieldValue
  export let displayValue: IUserFieldDisplayValue | null
  export let recordId: string
  export let isSelected: boolean
</script>

<div class={$$restProps.class}>
  <div class="flex w-full items-center justify-between">
    <UserFieldComponent disableHoverCard={!isSelected} {value} {displayValue} />
  </div>
</div>
