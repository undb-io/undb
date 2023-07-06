import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import { $eq, $is_empty, $is_not_empty, $neq } from '../../../filter/operators.js'
import { colorFieldValue } from './color-field.type.js'

export const colorFilterOperators = z.union([$is_empty, $is_not_empty, $eq, $neq])

export const colorFilterValue = colorFieldValue
export const colorFilter = z
  .object({
    type: z.literal('color'),
    operator: colorFilterOperators,
    value: colorFilterValue,
  })
  .merge(baseFilter)

export type IColorFilter = z.infer<typeof colorFilter>
export type IColorFilterOperator = z.infer<typeof colorFilterOperators>
