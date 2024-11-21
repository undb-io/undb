<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte"

  export let value: string
  export let readonly = false
  export let onValueChange: (value: string) => void
</script>

<Input
  bind:value
  {...$$restProps}
  type="email"
  on:change
  disabled={readonly}
  on:input={(e) => onValueChange?.(e.target.value)}
/>
