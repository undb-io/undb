<script lang="ts">
  import Tiptap from "$lib/components/tiptap/tiptap.svelte"
  import Textarea from "$lib/components/ui/textarea/textarea.svelte"
  import type { LongTextField } from "@undb/table"

  export let field: LongTextField
  export let value: string
  export let readonly = false
</script>

{#if field.allowRichText}
  <Tiptap {readonly} bind:value />
{:else}
  <Textarea rows={5} bind:value {...$$restProps} on:change disabled={readonly} />
{/if}
