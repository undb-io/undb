import { z } from 'zod'
import { fieldKeySchema } from '../field/value-objects/field-key.schema'
import { fieldNameSchema } from '../field/value-objects/field-name.schema'
import { rootFilter } from '../filter/filter'
import { calendarSchema } from './calendar'
import { kanbanSchema } from './kanban'
import { fieldHiddenSchema, fieldWidthSchema, viewFieldOption } from './view-field-options'
import { viewIdSchema } from './view-id.vo'
import { viewKeySchema } from './view-key.vo'
import { viewNameSchema } from './view-name.vo'

export const viewDisplayType = z.enum(['grid', 'kanban', 'calendar'])

export const createViewInput_internal = z.object({
  id: viewIdSchema.optional(),
  // TODO: set to optional
  key: viewKeySchema,
  name: viewNameSchema,
  kanban: kanbanSchema.optional(),
  calendar: calendarSchema.optional(),
  displayType: viewDisplayType.optional(),
  filter: rootFilter.optional(),
  fieldOptions: z.record(viewFieldOption).optional(),
  fieldsOrder: z.string().array().optional(),
})

export const queryView = z.object({
  key: z.string(),
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
  viewKey: viewNameSchema.optional(),
  fieldKey: fieldNameSchema,
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
  viewKey: viewNameSchema.optional(),
  from: fieldKeySchema,
  to: fieldKeySchema,
})

export type IMoveFieldSchema = z.infer<typeof moveFieldSchema>

export const switchDisplayTypeSchema = z.object({
  viewKey: viewNameSchema.optional(),
  displayType: viewDisplayType,
})

export type ISwitchDisplayTypeSchema = z.infer<typeof switchDisplayTypeSchema>

export const setKanbanFieldSchema = z.object({
  viewKey: viewNameSchema.optional(),
  field: fieldKeySchema,
})
export type ISetKanbanFieldSchema = z.infer<typeof setKanbanFieldSchema>

export const setCalendarFieldSchema = z.object({
  viewKey: viewNameSchema.optional(),
  field: fieldKeySchema,
})
export type ISetCalendarFieldSchema = z.infer<typeof setCalendarFieldSchema>
