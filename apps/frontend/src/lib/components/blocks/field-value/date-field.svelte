<script lang="ts">
  import { isDate } from "radash"

  export let value: string | Date | undefined = undefined
  export let placeholder: string | undefined = undefined

  $: internalValue = isDate(value) ? value.toISOString() : value
</script>

{#if internalValue}
  <span class={$$restProps.class}>{internalValue || ""}</span>
{:else}
  <span class={$$restProps.class}>{placeholder}</span>
{/if}
