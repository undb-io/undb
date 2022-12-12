import { z } from 'zod'
import { rootFilter } from '../filter'
import { viewNameSchema } from './view-name.vo'

export const viewDisplayType = z.enum(['grid', 'kanban'])

export const createViewInput_internal = z.object({
  name: viewNameSchema,
  displayType: viewDisplayType.optional(),
  filters: rootFilter,
})

export const queryView = z.object({
  name: z.string(),
  displayType: viewDisplayType,
  filters: rootFilter,
})

export const queryViews = z.array(queryView).optional()
