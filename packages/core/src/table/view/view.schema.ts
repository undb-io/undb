import { z } from 'zod'
import { fieldIdSchema } from '../field/value-objects/field-id.schema.js'
import { fieldNameSchema } from '../field/value-objects/field-name.schema.js'
import { rootFilter } from '../filter/filter.js'
import { calendarSchema } from './calendar/index.js'
import { createDashboardSchema, dashboardSchema } from './dashboard/dashboard.type.js'
import { gallerySchema } from './gallery/gallery.schema.js'
import { ganttSchema } from './gantt/gantt.schema.js'
import { kanbanSchema } from './kanban/index.js'
import { sortsSchema } from './sort/sort.schema.js'
import { treeViewSchema } from './tree-view/index.js'
import { fieldHiddenSchema, fieldWidthSchema, viewFieldOption } from './view-field-options.js'
import { viewIdSchema } from './view-id.vo.js'
import { viewNameSchema } from './view-name.vo.js'
import { viewPinnedFields } from './view-pinned-fields.js'
import { viewRowHeightSchema } from './view-row-height.vo.js'

export const viewDisplayType = z.enum(['grid', 'kanban', 'gallery', 'gantt', 'calendar', 'tree', 'dashboard'])

export const createViewSchema = z.object({
  id: viewIdSchema.optional(),
  name: viewNameSchema,
  displayType: viewDisplayType.optional(),
})

export type ICreateViewSchema = z.infer<typeof createViewSchema>

export const updateViewNameSchema = z.object({
  id: viewIdSchema,
  name: viewNameSchema,
})

export type IUpdateViewNameSchema = z.infer<typeof updateViewNameSchema>

export const createViewInput_internal = z.object({
  id: viewIdSchema.optional(),
  name: viewNameSchema,
  showSystemFields: z.boolean().optional(),
  sorts: sortsSchema.optional(),
  kanban: kanbanSchema.optional(),
  gallery: gallerySchema.optional(),
  gantt: ganttSchema.optional(),
  calendar: calendarSchema.optional(),
  dashboard: createDashboardSchema.optional(),
  tree: treeViewSchema.optional(),
  displayType: viewDisplayType.optional(),
  filter: rootFilter.optional(),
  fieldOptions: z.record(viewFieldOption).optional(),
  fieldsOrder: z.string().array().optional(),
  pinnedFields: viewPinnedFields.optional(),
  rowHeight: viewRowHeightSchema.optional(),
})

export const queryView = z.object({
  id: viewIdSchema,
  name: z.string(),
  showSystemFields: z.boolean().optional(),
  sorts: sortsSchema.optional(),
  kanban: kanbanSchema.optional(),
  gallery: gallerySchema.optional(),
  gantt: ganttSchema.optional(),
  calendar: calendarSchema.optional(),
  dashboard: dashboardSchema.optional(),
  tree: treeViewSchema.optional(),
  displayType: viewDisplayType,
  filter: rootFilter.optional(),
  fieldOptions: z.record(viewFieldOption).optional(),
  fieldsOrder: z.string().array().optional(),
  pinnedFields: viewPinnedFields.optional(),
  rowHeight: viewRowHeightSchema.optional(),
})

export const queryViews = z.array(queryView).optional()

const viewFieldOptionBaseSchema = z.object({
  viewId: viewIdSchema.optional(),
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
  viewId: viewIdSchema.optional(),
  from: fieldIdSchema,
  to: fieldIdSchema,
})

export type IMoveFieldSchema = z.infer<typeof moveFieldSchema>

export const switchDisplayTypeSchema = z.object({
  viewId: viewIdSchema.optional(),
  displayType: viewDisplayType,
})

export type ISwitchDisplayTypeSchema = z.infer<typeof switchDisplayTypeSchema>

export const setRowHeight = z.object({
  viewId: viewIdSchema.optional(),
  rowHeight: viewRowHeightSchema,
})
export type ISetRowHeight = z.infer<typeof setRowHeight>

export const setKanbanFieldSchema = z.object({
  viewId: viewIdSchema.optional(),
  field: fieldIdSchema,
})
export type ISetKanbanFieldSchema = z.infer<typeof setKanbanFieldSchema>

export const setCalendarFieldSchema = z.object({
  viewId: viewIdSchema.optional(),
  field: fieldIdSchema,
})
export type ISetCalendarFieldSchema = z.infer<typeof setCalendarFieldSchema>

export const setGanttFieldSchema = z.object({
  viewId: viewIdSchema.optional(),
  field: fieldIdSchema,
})
export type ISetGanttFieldSchema = z.infer<typeof setGanttFieldSchema>

export const setTreeViewFieldSchema = z.object({
  viewId: viewIdSchema.optional(),
  field: fieldIdSchema,
})
export type ISetTreeViewFieldSchema = z.infer<typeof setTreeViewFieldSchema>

export const moveViewSchema = z.object({
  from: viewIdSchema,
  to: viewIdSchema,
})

export type IMoveViewSchema = z.infer<typeof moveViewSchema>

export const setPinnedFieldsSchema = z.object({
  viewId: viewIdSchema.optional(),
  pinnedFields: viewPinnedFields,
})

export type ISetPinnedFieldsSchema = z.infer<typeof setPinnedFieldsSchema>

export const setGalleryFieldSchema = z.object({
  viewId: viewIdSchema.optional(),
  field: fieldIdSchema,
})
export type ISetGalleryFieldSchema = z.infer<typeof setGalleryFieldSchema>

export const duplicateViewSchema = z.object({
  name: viewNameSchema.optional(),
})

export type IDuplciateViewSchema = z.infer<typeof duplicateViewSchema>
