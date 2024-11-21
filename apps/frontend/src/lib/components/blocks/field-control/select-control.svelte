<script lang="ts">
  import type { IOptionId, SelectField } from "@undb/table"
  import OptionPicker from "../option/option-picker.svelte"
  import OptionsPicker from "../option/options-picker.svelte"

  export let readonly = false

  export let field: SelectField
  export let value: IOptionId | IOptionId[] | null = null
  export let onValueChange: (value: IOptionId | IOptionId[] | null) => void
</script>

{#if field.isSingle}
  {#if !Array.isArray(value)}
    <OptionPicker {onValueChange} disabled={readonly} options={field.options} bind:value sameWidth {...$$restProps} />
  {/if}
{:else if Array.isArray(value) || value === null || value === undefined}
  <OptionsPicker {onValueChange} disabled={readonly} options={field.options} bind:value sameWidth {...$$restProps} />
{/if}
