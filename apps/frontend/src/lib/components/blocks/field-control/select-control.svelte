<script lang="ts">
  import type { IOptionId, SelectField } from "@undb/table"
  import OptionPicker from "../option/option-picker.svelte"
  import OptionsPicker from "../option/options-picker.svelte"

  export let readonly = false

  export let field: SelectField
  export let value: IOptionId | IOptionId[] | null = null
</script>

{#if field.isSingle}
  {#if !Array.isArray(value)}
    <OptionPicker {field} bind:value />
  {/if}
{:else if Array.isArray(value) || value === null}
  <OptionsPicker {field} bind:value />
{/if}
