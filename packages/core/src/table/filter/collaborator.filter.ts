import { z } from 'zod'
import { collaboratorFieldValue } from '../field/collaborator-field.type.js'
import { baseFilter } from './filter.base.js'
import { collaboratorFilterOperators } from './operators.js'

export const collaboratorFilterValue = collaboratorFieldValue
export const collaboratorFilter = z
  .object({
    type: z.literal('collaborator'),
    operator: collaboratorFilterOperators,
    value: collaboratorFilterValue,
  })
  .merge(baseFilter)

export type ICollaboratorFilter = z.infer<typeof collaboratorFilter>
export type ICollaboratorFilterOperator = z.infer<typeof collaboratorFilterOperators>
