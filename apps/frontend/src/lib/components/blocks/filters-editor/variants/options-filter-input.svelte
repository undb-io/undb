<script lang="ts">
  import type { SelectField } from "@undb/table"
  import OptionsPicker from "../../option/options-picker.svelte"

  export let field: SelectField
  export let value: any
  export let disabled = false

  export let onValueChange: (value: string[] | null) => void = () => {}
</script>

<OptionsPicker {disabled} {...$$restProps} bind:value options={field.options} {onValueChange} />
