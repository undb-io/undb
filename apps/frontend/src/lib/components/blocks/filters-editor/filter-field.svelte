<script lang="ts">
  import type { FieldType } from "@undb/table"
  import FieldPicker from "../field-picker/field-picker.svelte"

  export let value: string | undefined
  export let filter: ((field: any) => boolean) | undefined = undefined
  export let onValueChange: ((value: FieldType | undefined, prev: FieldType) => void) | undefined = undefined
  export let sameWidth = true
</script>

<FieldPicker bind:value {...$$restProps} {filter} {onValueChange} {sameWidth} />
