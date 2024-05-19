<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte"

  export let value: string
  export let onValueChange = (value: string) => {}
</script>

<Input bind:value {...$$restProps} on:blur={(e) => onValueChange(e.target.value)} />
