import { z } from 'zod'
import { baseFilter } from './filter.base.js'
import { emailFilterOperators } from './operators.js'

export const emailFilterValue = z.string().nullable()
export const emailFilter = z
  .object({
    type: z.literal('email'),
    operator: emailFilterOperators,
    value: emailFilterValue,
  })
  .merge(baseFilter)

export type IEmailFilter = z.infer<typeof emailFilter>
export type IEmailFilterOperator = z.infer<typeof emailFilterOperators>
