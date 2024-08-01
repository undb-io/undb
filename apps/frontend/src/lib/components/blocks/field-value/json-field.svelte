<script lang="ts">
  import type { JsonValue } from "type-fest"

  export let value: JsonValue | undefined = undefined
</script>

{#if value}
  <span class={$$restProps.class}>{JSON.stringify(value)}</span>
{/if}
