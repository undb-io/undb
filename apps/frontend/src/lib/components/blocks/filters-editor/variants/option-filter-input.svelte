<script lang="ts">
  import type { SelectField } from "@undb/table"
  import OptionPicker from "../../option/option-picker.svelte"

  export let field: SelectField
  export let value: any
  export let disabled = false

  export let onValueChange: (value: any) => void = () => {}
</script>

<OptionPicker {disabled} {...$$restProps} bind:value options={field.options} {onValueChange} />
