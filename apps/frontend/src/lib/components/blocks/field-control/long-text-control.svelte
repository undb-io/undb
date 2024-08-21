<script lang="ts">
  import Textarea from "$lib/components/ui/textarea/textarea.svelte"

  export let value: string
  export let readonly = false
</script>

<Textarea rows={5} bind:value {...$$restProps} on:change disabled={readonly} />
