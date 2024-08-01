import { z } from "@undb/zod"

export const colors = z.enum([
  //
  "blue",
  "green",
  "purple",
  "orange",
  "yellow",
  "red",
  "black",
  "pink",
  "cyan",
  "teal",
  "gray",
  "indigo",
])

export type IColors = z.infer<typeof colors>

export const COLORS = colors.options
