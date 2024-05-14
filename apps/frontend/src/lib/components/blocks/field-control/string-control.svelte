<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte"

  export let value: string
</script>

<Input bind:value {...$$restProps} />
