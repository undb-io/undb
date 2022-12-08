import { z } from 'zod'
import { viewNameSchema } from './view-name.vo'

export const viewDisplayType = z.enum(['grid', 'kanban'])

export const createViewInput_internal = z.object({
  name: viewNameSchema,
  displayType: viewDisplayType.optional(),
})

export const queryView = z.object({
  name: z.string(),
  displayType: viewDisplayType,
})
