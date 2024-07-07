<script lang="ts">
  export let value: string | undefined = undefined
  export let placeholder: string | undefined = undefined
</script>

{#if !value}
  <div>
    {placeholder || ""}
  </div>
{:else}
  <div class={$$restProps.class}>{value}</div>
{/if}
