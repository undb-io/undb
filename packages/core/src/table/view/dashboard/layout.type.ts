import { z } from 'zod'

export const layoutSchema = z.object({
  x: z.number().nonnegative(),
  y: z.number().nonnegative(),
  w: z.number().nonnegative(),
  h: z.number().nonnegative(),
})

export type ILayoutSchema = z.infer<typeof layoutSchema>
