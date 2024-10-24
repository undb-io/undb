<script lang="ts">
  import type { LongTextField } from "@undb/table"

  export let value: string | undefined = undefined
  export let placeholder: string | undefined = undefined

  export let field: LongTextField
</script>

{#if !value}
  <div>
    {placeholder || ""}
  </div>
{:else}
  <div class={$$restProps.class}>
    {#if field.allowRichText}
      <article class="prose-sm max-w-full">
        {@html value}
      </article>
    {:else}
      {value}
    {/if}
  </div>
{/if}
