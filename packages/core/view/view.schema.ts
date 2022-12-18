import { z } from 'zod'
import { fieldNameSchema } from '../field'
import { rootFilter } from '../filter'
import { fieldWidthSchema, viewFieldOption } from './view-field-options'
import { viewNameSchema } from './view-name.vo'

export const viewDisplayType = z.enum(['grid', 'kanban'])

export const createViewInput_internal = z.object({
  name: viewNameSchema,
  displayType: viewDisplayType.optional(),
  filter: rootFilter.optional(),
  fieldOptions: z.record(viewFieldOption).optional(),
})

export const queryView = z.object({
  name: z.string(),
  displayType: viewDisplayType,
  filter: rootFilter.optional(),
  fieldOptions: z.record(viewFieldOption).optional(),
})

export const queryViews = z.array(queryView).optional()

export const setFieldWidthSchema = z.object({
  viewName: viewNameSchema.optional(),
  fieldName: fieldNameSchema,
  width: fieldWidthSchema,
})

export type ISetFieldWidthSchema = z.infer<typeof setFieldWidthSchema>
