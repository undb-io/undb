import { z } from 'zod'
import { userIdSchema } from '../../../../user/value-objects/user-id.vo.js'
import { baseFilter } from '../../../filter/filter.base.js'
import { $eq, $in, $is_empty, $is_not_empty, $neq, $nin } from '../../../filter/operators.js'
import { multiSelectFieldValue } from './multi-select-field.type.js'

export const multiSelectFilterOperators = z.union([$eq, $neq, $in, $nin, $is_empty, $is_not_empty])

export const multiSelectFilterValue = multiSelectFieldValue.or(userIdSchema)
export type IMultiSelectFilterValue = z.infer<typeof multiSelectFilterValue>

export const multiSelectFilter = z
  .object({
    type: z.literal('multi-select'),
    operator: multiSelectFilterOperators,
    value: multiSelectFilterValue,
  })
  .merge(baseFilter)

export type IMultiSelectFilter = z.infer<typeof multiSelectFilter>
export type IMultiSelectFilterOperator = z.infer<typeof multiSelectFilterOperators>
