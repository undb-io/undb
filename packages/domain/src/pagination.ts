import { z } from 'zod'

export const paginationSchema = z.object({
  limit: z.number().positive().int().optional(),
  page: z.number().positive().int().optional(),
})

export type IPagination = z.infer<typeof paginationSchema>
