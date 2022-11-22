import * as z from 'zod'

export const createTableCommandSchema = z.object({
  name: z.string(),
})
