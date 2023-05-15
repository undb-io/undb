import { z } from 'zod'

export const createLayoutSchema = z.object({
  x: z.number().nonnegative().default(0),
  y: z.number().nonnegative().default(0),
  h: z.number().nonnegative().default(2),
  w: z.number().nonnegative().default(2),
})
