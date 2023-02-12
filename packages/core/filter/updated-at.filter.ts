import { z } from 'zod'
import { baseFilter } from './filter.base.js'
import { updatedAtFilterOperators } from './operators.js'

export const updatedAtFilterValue = z.date().nullable()
export const updatedAtFilter = z
  .object({
    type: z.literal('updated-at'),
    operator: updatedAtFilterOperators,
    value: updatedAtFilterValue,
  })
  .merge(baseFilter)

export type IUpdatedAtFilter = z.infer<typeof updatedAtFilter>
