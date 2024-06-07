<script lang="ts">
  import type { ReferenceField } from "@undb/table"
  import ForeignRecordsPickerDropdown from "../reference/foreign-records-picker-dropdown.svelte"

  export let field: ReferenceField
  export let value: string[]
</script>

{value}
<ForeignRecordsPickerDropdown foreignTableId={field.foreignTableId} bind:value />
