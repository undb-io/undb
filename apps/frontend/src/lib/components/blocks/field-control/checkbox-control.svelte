<script lang="ts">
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte"

  export let readonly = false
  export let value: boolean
</script>

<Checkbox {...$$restProps} disabled={readonly} bind:checked={value} />
