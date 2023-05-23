import { z } from 'zod'
import { currencyFieldValue } from '../field/currency-field.type.js'
import { baseFilter } from './filter.base.js'
import { currencyFilterOperators } from './operators.js'

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
