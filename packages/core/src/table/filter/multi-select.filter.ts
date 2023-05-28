import { z } from 'zod'
import { userIdSchema } from '../../user/value-objects/user-id.vo.js'
import { multiSelectFieldValue } from '../field/multi-select-field.type.js'
import { baseFilter } from './filter.base.js'
import { multiSelectFilterOperators } from './operators.js'

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
