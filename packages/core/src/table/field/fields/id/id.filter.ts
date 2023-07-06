import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import { $eq, $in, $neq, $nin } from '../../../filter/operators.js'
import { recordIdSchema } from '../../../record/value-objects/record-id.schema.js'

export const idFilterOperators = z.union([$eq, $neq, $in, $nin])
export type IIdFilterOperator = z.infer<typeof idFilterOperators>

export const idFilterValue = recordIdSchema
export const idFilter = z
  .object({
    type: z.literal('id'),
    operator: idFilterOperators,
    value: idFilterValue.or(recordIdSchema.array()),
  })
  .merge(baseFilter)

export type IIdFilter = z.infer<typeof idFilter>
