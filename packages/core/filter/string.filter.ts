import { z } from 'zod'
import { baseFilter } from './filter.base'
import { stringFilterOperators } from './operators'

export const stringFilterValue = z.string().nullable()
export const stringFilter = z
  .object({
    type: z.literal('string'),
    operator: stringFilterOperators,
    value: stringFilterValue,
  })
  .merge(baseFilter)

export type IStringFilter = z.infer<typeof stringFilter>
export type IStringFilterOperator = z.infer<typeof stringFilterOperators>
