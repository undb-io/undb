import { z } from 'zod'

export const aggregateNumberQueryOutput = z.object({
  number: z.number(),
})
