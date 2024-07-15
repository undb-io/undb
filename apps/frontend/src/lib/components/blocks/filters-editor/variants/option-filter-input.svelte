<script lang="ts">
  import type { SelectField } from "@undb/table"
  import OptionPicker from "../../option/option-picker.svelte"

  export let field: SelectField
  export let value: any
</script>

<OptionPicker {...$$restProps} bind:value options={field.options} />
