<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte"
  import { cn } from "$lib/utils"

  export let value: number
  const onInput = (event: Event) => {
    value = +(event.target as HTMLInputElement).value
    onValueChange(value)
  }
  export let onValueChange = (value: number) => {}
</script>

<Input
  {...$$restProps}
  class={cn($$restProps.class, "rounded-none border-none outline-none focus:bg-white")}
  {value}
  on:input={onInput}
  type="number"
/>
