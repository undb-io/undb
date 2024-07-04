<script lang="ts">
  export let value: string | undefined = undefined
  export let placeholder: string | undefined = undefined
</script>

{#if !value}
  {placeholder || ""}
{:else}
  <span class={$$restProps.class}>{value}</span>
{/if}
