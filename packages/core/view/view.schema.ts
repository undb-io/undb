import { z } from 'zod'
import { $filter } from '../filter'
import { viewNameSchema } from './view-name.vo'

export const viewDisplayType = z.enum(['grid', 'kanban'])

export const createViewInput_internal = z.object({
  name: viewNameSchema,
  displayType: viewDisplayType.optional(),
  filters: $filter.optional(),
})

export const queryView = z.object({
  name: z.string(),
  displayType: viewDisplayType,
  filters: $filter.optional(),
})

export const queryViews = z.array(queryView).optional()
