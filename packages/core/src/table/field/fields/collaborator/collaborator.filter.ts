import { z } from 'zod'
import { userIdSchema } from '../../../../user/value-objects/user-id.vo.js'
import { baseFilter } from '../../../filter/filter.base.js'
import { $eq, $is_empty, $is_me, $is_not_empty, $is_not_me, $neq } from '../../../filter/operators.js'
import { collaboratorFieldValue } from './collaborator-field.type.js'

export const collaboratorFilterOperators = z.union([$eq, $neq, $is_empty, $is_not_empty, $is_me, $is_not_me])
export type ICollaboratorFilterOperator = z.infer<typeof collaboratorFilterOperators>

export const collaboratorFilterValue = collaboratorFieldValue.or(userIdSchema).nullable()
export const collaboratorFilter = z
  .object({
    type: z.literal('collaborator'),
    operator: collaboratorFilterOperators,
    value: collaboratorFilterValue,
  })
  .merge(baseFilter)

export type ICollaboratorFilter = z.infer<typeof collaboratorFilter>
