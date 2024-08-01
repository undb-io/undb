<script lang="ts">
  import { isDate } from "radash"

  export let value: string | Date | undefined = undefined
  export let placeholder: string | undefined = undefined

  $: internalValue = isDate(value) ? value.toISOString() : value
</script>

{#if internalValue}
  <div class={$$restProps.class}>{internalValue || ""}</div>
{:else}
  <div class={$$restProps.class}>{placeholder}</div>
{/if}
