<script lang="ts">
  import type { FieldType, TableDo } from "@undb/table"
  import FieldPicker from "../field-picker/field-picker.svelte"
  import type { Writable } from "svelte/store"

  export let value: string | undefined
  export let filter: ((field: any) => boolean) | undefined = undefined
  export let onValueChange: ((value: FieldType | undefined, prev: FieldType) => void) | undefined = undefined
  export let sameWidth = true
  export let table: Writable<TableDo> | undefined = undefined
  export let disabled = false
</script>

<FieldPicker bind:table bind:value {disabled} {...$$restProps} {filter} {onValueChange} {sameWidth} />
