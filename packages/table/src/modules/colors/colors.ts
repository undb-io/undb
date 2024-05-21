import { z } from "@undb/zod"

export const colors = z.enum([
  //
  "red",
  "green",
  "blue",
  "yellow",
  "purple",
  "black",
  "gray",
  "orange",
  "pink",
  "cyan",
  "teal",
  "indigo",
])

export type IColors = z.infer<typeof colors>

export const COLORS = colors.options
