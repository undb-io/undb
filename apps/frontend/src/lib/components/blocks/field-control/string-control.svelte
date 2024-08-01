<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte"

  export let value: string
  export let readonly = false
</script>

<Input bind:value {...$$restProps} on:change disabled={readonly} />
