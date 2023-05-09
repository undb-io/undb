import * as z from 'zod'

export const aggregateNumberQuerySchema = z.object({
  tableId: z.string(),
})
