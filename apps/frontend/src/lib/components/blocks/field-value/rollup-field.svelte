<script lang="ts">
  export let value: string | Date | undefined = undefined
</script>

{#if value !== null}
  <span class={$$restProps.class}>{value}</span>
{/if}
