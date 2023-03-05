import { z } from 'zod'
import { colorFieldValue } from '../field/color-field.type.js'
import { baseFilter } from './filter.base.js'
import { colorFilterOperators } from './operators.js'

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
