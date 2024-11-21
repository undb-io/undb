<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte"

  export let readonly = false
  export let value: number
  export let onValueChange: (value: number) => void
  const onInput = (event: Event) => {
    value = +(event.target as HTMLInputElement).value
    onValueChange?.(value)
  }
</script>

<Input
  class={$$restProps.class}
  disabled={readonly}
  {value}
  on:input={onInput}
  type="number"
  step={0.01}
  {...$$restProps}
/>
