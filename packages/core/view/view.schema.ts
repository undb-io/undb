import { z } from 'zod'
import { fieldIdSchema } from '../field/value-objects/field-id.schema'
import { fieldNameSchema } from '../field/value-objects/field-name.schema'
import { rootFilter } from '../filter/filter'
import { calendarSchema } from './calendar'
import { kanbanSchema } from './kanban'
import { fieldHiddenSchema, fieldWidthSchema, viewFieldOption } from './view-field-options'
import { viewIdSchema } from './view-id.vo'
import { viewNameSchema } from './view-name.vo'

export const viewDisplayType = z.enum(['grid', 'kanban', 'calendar'])

export const createViewInput_internal = z.object({
  // TODO: set to optional
  id: viewIdSchema,
  name: viewNameSchema,
  kanban: kanbanSchema.optional(),
  calendar: calendarSchema.optional(),
  displayType: viewDisplayType.optional(),
  filter: rootFilter.optional(),
  fieldOptions: z.record(viewFieldOption).optional(),
  fieldsOrder: z.string().array().optional(),
})

export const queryView = z.object({
  id: z.string(),
  name: z.string(),
  kanban: kanbanSchema.optional(),
  calendar: calendarSchema.optional(),
  displayType: viewDisplayType,
  filter: rootFilter.optional(),
  fieldOptions: z.record(viewFieldOption).optional(),
  fieldsOrder: z.string().array().optional(),
})

export const queryViews = z.array(queryView).optional()

const viewFieldOptionBaseSchema = z.object({
  viewId: viewNameSchema.optional(),
  fieldId: fieldNameSchema,
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
  viewId: viewNameSchema.optional(),
  from: fieldIdSchema,
  to: fieldIdSchema,
})

export type IMoveFieldSchema = z.infer<typeof moveFieldSchema>

export const switchDisplayTypeSchema = z.object({
  viewId: viewNameSchema.optional(),
  displayType: viewDisplayType,
})

export type ISwitchDisplayTypeSchema = z.infer<typeof switchDisplayTypeSchema>

export const setKanbanFieldSchema = z.object({
  viewId: viewNameSchema.optional(),
  field: fieldIdSchema,
})
export type ISetKanbanFieldSchema = z.infer<typeof setKanbanFieldSchema>

export const setCalendarFieldSchema = z.object({
  viewId: viewNameSchema.optional(),
  field: fieldIdSchema,
})
export type ISetCalendarFieldSchema = z.infer<typeof setCalendarFieldSchema>
