<script lang="ts">
  import { Switch as SwitchPrimitive } from "bits-ui"
  import { cn } from "$lib/utils.js"
  import { switchVariants, type SwitchProps } from "."

  type $$Props = SwitchProps
  type $$Events = SwitchPrimitive.Events

  let className: $$Props["class"] = undefined
  export let size: $$Props["size"] = "default"
  export let checked: $$Props["checked"] = undefined
  export { className as class }
</script>

<SwitchPrimitive.Root bind:checked class={cn(switchVariants({ className, size }))} {...$$restProps} on:click on:keydown>
  <SwitchPrimitive.Thumb
    class={cn(
      "bg-background pointer-events-none block h-4 w-4 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
      size === "sm" && "h-3 w-3 data-[state=checked]:translate-x-3",
    )}
  />
</SwitchPrimitive.Root>
