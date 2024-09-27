<script lang="ts">
  import Switch from "$lib/components/ui/switch/switch.svelte"

  export let readonly = false
  export let value: boolean
</script>

<div class="flex h-full items-center">
  <Switch {...$$restProps} disabled={readonly} bind:checked={value} />
</div>
