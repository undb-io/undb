<script lang="ts">
  import Switch from "$lib/components/ui/switch/switch.svelte"

  export let readonly = false
  export let value: boolean
  export let onValueChange: (value: boolean) => void
</script>

<div class="flex h-full items-center">
  <Switch
    {...$$restProps}
    disabled={readonly}
    bind:checked={value}
    on:change={(e) => onValueChange?.(e.target.checked)}
  />
</div>
