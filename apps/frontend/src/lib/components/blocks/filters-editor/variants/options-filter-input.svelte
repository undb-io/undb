<script lang="ts">
  import type { SelectField } from "@undb/table"
  import OptionsPicker from "../../option/options-picker.svelte"

  export let field: SelectField
  export let value: any
  export let disabled = false
</script>

<OptionsPicker {disabled} {...$$restProps} bind:value options={field.options} />
