import { z } from 'zod'
import { selectFieldValue } from '../field/select-field.type'
import { baseFilter } from './filter.base'
import { selectFilterOperators } from './operators'

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
