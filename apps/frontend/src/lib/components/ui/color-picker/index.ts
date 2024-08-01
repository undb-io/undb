import type { IColors } from "@undb/table"
import { tv, type VariantProps } from "tailwind-variants"

const colorPickerVariants = tv({
  variants: {
    size: {
      default: "h-6 w-6",
      sm: "h-4 w-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

type Size = VariantProps<typeof colorPickerVariants>["size"]

type Props = {
  size?: Size
  value?: IColors
  class?: string
  onColorChange?(color: IColors): void
}

export {
  //
  colorPickerVariants,
  type Props as ColorPickerProps,
  type Props,
}
