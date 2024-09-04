import { z } from "@undb/zod"

export const colors = z.enum([
  //
  "yellow",
  "blue",
  "red",
  "lime",
  "green",
  "emerald",
  "teal",
  "sky",
  "purple",
  "orange",
  "pink",
  "cyan",
  "gray",
  "violet",
  "purple",
  "rose",
  "indigo",
  "black",
])

export type IColors = z.infer<typeof colors>

export const COLORS = colors.options
