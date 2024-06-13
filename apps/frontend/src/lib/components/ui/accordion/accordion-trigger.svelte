<script lang="ts">
  import { Accordion as AccordionPrimitive } from "bits-ui"
  import { cn } from "$lib/utils.js"

  type $$Props = AccordionPrimitive.TriggerProps
  type $$Events = AccordionPrimitive.TriggerEvents

  let className: $$Props["class"] = undefined
  export let level: AccordionPrimitive.HeaderProps["level"] = 3
  export { className as class }
</script>

<AccordionPrimitive.Header {level} class="flex">
  <AccordionPrimitive.Trigger
    class={cn(
      "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
      className,
    )}
    {...$$restProps}
    on:click
  >
    <slot />
  </AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
