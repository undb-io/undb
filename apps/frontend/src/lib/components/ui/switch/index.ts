import { Switch as SwitchPrimitive } from "bits-ui"
import { tv, type VariantProps } from "tailwind-variants"
import Root from "./switch.svelte"

const switchVariants = tv({
  base: "focus-visible:ring-ring focus-visible:ring-offset-background data-[state=checked]:bg-primary data-[state=unchecked]:bg-input peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",

  variants: {
    size: {
      default: "h-[20px] w-[36px]",
      sm: "h=[16px] w-[28px]",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

type Size = VariantProps<typeof switchVariants>["size"]

type Props = SwitchPrimitive.Props & {
  size?: Size
}

export {
  Root,
  //
  Root as Switch,
  switchVariants,
  type Props as SwitchProps,
}
