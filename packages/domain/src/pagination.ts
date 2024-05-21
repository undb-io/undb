import { z } from "@undb/zod"

export const simplePaginationSchema = z.object({
  limit: z.number().positive().int().optional(),
  page: z.number().positive().int().optional(),
})

export const pagniationSchema = simplePaginationSchema

export type ISimplePagination = z.infer<typeof simplePaginationSchema>

export type IPagination = ISimplePagination

export interface PaginatedDTO<V> {
  total: number
  values: V[]
}
