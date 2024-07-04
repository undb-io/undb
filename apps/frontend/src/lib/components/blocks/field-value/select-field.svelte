<script lang="ts">
  import Option from "$lib/components/blocks/option/option.svelte"
  import type { SelectField } from "@undb/table"

  export let value: string | undefined = undefined
  export let placeholder: string | undefined = undefined
  export let field: SelectField

  $: option = field.options.find((option) => option.id === value)
</script>

{#if option}
  <Option {option} />
{:else}
  {placeholder}
{/if}
