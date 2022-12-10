import { z } from 'zod'
import { $filters } from '../filter'
import { viewNameSchema } from './view-name.vo'

export const viewDisplayType = z.enum(['grid', 'kanban'])

export const createViewInput_internal = z.object({
  name: viewNameSchema,
  displayType: viewDisplayType.optional(),
  filters: $filters,
})

export const queryView = z.object({
  name: z.string(),
  displayType: viewDisplayType,
  filters: $filters,
})

export const queryViews = z.array(queryView).optional()
