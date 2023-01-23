import { z } from 'zod'
import { baseFilter } from './filter.base'
import { createdAtFilterOperators } from './operators'

export const createdAtFilterValue = z.date().nullable()
export const createdAtFilter = z
  .object({
    type: z.literal('created-at'),
    operator: createdAtFilterOperators,
    value: createdAtFilterValue,
  })
  .merge(baseFilter)

export type ICreatedAtFilter = z.infer<typeof createdAtFilter>
