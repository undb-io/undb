import { z } from "zod"

export const colors = z.enum(["red", "green", "blue"])

export type IColors = z.infer<typeof colors>
