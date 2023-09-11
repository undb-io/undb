import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import { $eq, $in, $is_empty, $is_not_empty, $neq, $nin } from '../../../filter/operators.js'
import { selectFieldValue } from './select-field.type.js'

export const selectFilterOperators = z.union([$eq, $neq, $in, $nin, $is_empty, $is_not_empty])
export type ISelectFilterOperator = z.infer<typeof selectFilterOperators>

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
