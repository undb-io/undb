<script lang="ts">
  import Switch from "$lib/components/ui/switch/switch.svelte"

  export let readonly = false
  export let value: boolean
</script>

<Switch {...$$restProps} disabled={readonly} bind:checked={value} />
