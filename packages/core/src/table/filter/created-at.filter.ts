import { z } from 'zod'
import { baseFilter } from './filter.base.js'
import { createdAtFilterOperators } from './operators.js'

export const createdAtFilterValue = z.string().datetime().nullable()
export const createdAtFilter = z
  .object({
    type: z.literal('created-at'),
    operator: createdAtFilterOperators,
    value: createdAtFilterValue,
  })
  .merge(baseFilter)

export type ICreatedAtFilter = z.infer<typeof createdAtFilter>
