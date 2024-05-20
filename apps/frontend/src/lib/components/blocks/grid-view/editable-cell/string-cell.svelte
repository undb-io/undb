<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte"
  import { cn } from "$lib/utils"

  export let value: string
</script>

<Input
  bind:value
  {...$$restProps}
  class={cn($$restProps.class, "rounded-none border-none outline-none  focus:bg-white")}
/>
