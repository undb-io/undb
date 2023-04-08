import { z } from 'zod'
import { selectFieldValue } from '../field/select-field.type.js'
import { baseFilter } from './filter.base.js'
import { selectFilterOperators } from './operators.js'

export const selectFilterValue = selectFieldValue.or(selectFieldValue.array()).nullable()
export type ISelectFilterValue = z.infer<typeof selectFieldValue>
export const selectFilter = z
  .object({
    type: z.literal('select'),
    operator: selectFilterOperators,
    value: selectFilterValue,
  })
  .merge(baseFilter)

export type ISelectFilter = z.infer<typeof selectFilter>
