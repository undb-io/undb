import * as z from 'zod'

export const getTableQuerySchema = z.object({
  id: z.string(),
})
