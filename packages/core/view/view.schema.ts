import { z } from 'zod'
import { fieldIdSchema, fieldNameSchema } from '../field'
import { rootFilter } from '../filter/filter'
import { kanbanSchema } from './kanban.schema'
import { fieldHiddenSchema, fieldWidthSchema, viewFieldOption } from './view-field-options'
import { viewNameSchema } from './view-name.vo'

export const viewDisplayType = z.enum(['grid', 'kanban'])

export const createViewInput_internal = z.object({
  name: viewNameSchema,
  kanban: kanbanSchema.optional(),
  displayType: viewDisplayType.optional(),
  filter: rootFilter.optional(),
  fieldOptions: z.record(viewFieldOption).optional(),
  fieldsOrder: z.string().array().optional(),
})

export const queryView = z.object({
  name: z.string(),
  kanban: kanbanSchema.optional(),
  displayType: viewDisplayType,
  filter: rootFilter.optional(),
  fieldOptions: z.record(viewFieldOption).optional(),
  fieldsOrder: z.string().array().optional(),
})

export const queryViews = z.array(queryView).optional()

const viewFieldOptionBaseSchema = z.object({
  viewName: viewNameSchema.optional(),
  fieldName: fieldNameSchema,
})

export const setFieldWidthSchema = z
  .object({
    width: fieldWidthSchema,
  })
  .merge(viewFieldOptionBaseSchema)
export type ISetFieldWidthSchema = z.infer<typeof setFieldWidthSchema>

export const setFieldVisibilitySchema = z
  .object({
    hidden: fieldHiddenSchema.unwrap(),
  })
  .merge(viewFieldOptionBaseSchema)

export type ISetFieldVisibilitySchema = z.infer<typeof setFieldVisibilitySchema>

export const moveFieldSchema = z.object({
  viewName: viewNameSchema.optional(),
  from: fieldIdSchema,
  to: fieldIdSchema,
})

export type IMoveFieldSchema = z.infer<typeof moveFieldSchema>

export const switchDisplayTypeSchema = z.object({
  viewName: viewNameSchema.optional(),
  displayType: viewDisplayType,
})

export type ISwitchDisplayTypeSchema = z.infer<typeof switchDisplayTypeSchema>

export const setKanbanFieldSchema = z.object({
  viewName: viewNameSchema.optional(),
  field: fieldIdSchema,
})
export type ISetKanbanFieldSchema = z.infer<typeof setKanbanFieldSchema>
