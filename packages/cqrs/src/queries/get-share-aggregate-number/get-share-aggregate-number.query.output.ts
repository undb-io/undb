import { z } from 'zod'

export const getShareAggregateNumberQueryOutput = z.object({
  number: z.number(),
})
