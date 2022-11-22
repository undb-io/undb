import * as z from 'zod'

export const getTableQueryOutput = z.object({
  id: z.string(),
})
