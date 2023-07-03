import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import { $eq, $gt, $gte, $lt, $lte, $neq } from '../../../filter/operators.js'
import { currencyFieldValue } from './currency-field.type.js'

export const currencyFilterOperators = z.union([$eq, $neq, $gt, $gte, $lt, $lte])

export const currencyFilterValue = currencyFieldValue
export const currencyFilter = z
  .object({
    type: z.literal('currency'),
    operator: currencyFilterOperators,
    value: currencyFilterValue,
  })
  .merge(baseFilter)

export type ICurrencyFilter = z.infer<typeof currencyFilter>
export type ICurrencyFilterOperator = z.infer<typeof currencyFilterOperators>
