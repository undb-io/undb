import * as z from 'zod'

export const createTableCommandInput = z.object({
  name: z.string().min(2).max(20),
})
