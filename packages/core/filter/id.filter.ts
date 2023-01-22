import { z } from 'zod'
import { recordIdSchema } from '../record/value-objects/record-id.schema'
import { baseFilter } from './filter.base'
import { idFilterOperators } from './operators'

export const idFilterValue = recordIdSchema
export const idFilter = z
  .object({
    type: z.literal('id'),
    operator: idFilterOperators,
    value: idFilterValue,
  })
  .merge(baseFilter)

export type IIdFilter = z.infer<typeof idFilter>
