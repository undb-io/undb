import type { z } from 'zod'
import type { IRootFilter } from '../filter/index.js'
import type { RootFilter } from '../filter/root-filter.js'
import type { Calendar, ICalendarSchema } from './calendar/index.js'
import type { IDashboardSchema } from './dashboard/dashboard.type.js'
import type { Dashboard } from './dashboard/dashboard.vo.js'
import type { Gallery } from './gallery/gallery.js'
import type { IGallerySchema } from './gallery/gallery.schema.js'
import type { Gantt } from './gantt/gantt.js'
import type { IGanttSchema } from './gantt/gantt.schema.js'
import type { IKanbanSchema, Kanban } from './kanban/index.js'
import type { ISorts } from './sort/sort.schema.js'
import type { Sorts } from './sort/sorts.js'
import type { ITreeViewSchema, TreeView } from './tree-view/index.js'
import type { IViewFieldOption, ViewFieldOptions } from './view-field-options.js'
import type { ViewFieldsOrder } from './view-fields-order.vo.js'
import type { ViewId } from './view-id.vo.js'
import type { ViewName } from './view-name.vo.js'
import type { IViewPinnedFields, ViewPinnedFields } from './view-pinned-fields.js'
import type { IViewRowHeight, ViewRowHeight } from './view-row-height.vo.js'
import type { createViewInput_internal, viewDisplayType } from './view.schema.js'

export interface IView {
  id: ViewId
  name: ViewName
  displayType: IViewDisplayType
  showSystemFields?: boolean
  sorts?: Sorts
  kanban?: Kanban
  gallery?: Gallery
  gantt?: Gantt
  calendar?: Calendar
  dashboard?: Dashboard
  tree?: TreeView
  filter?: RootFilter
  fieldOptions: ViewFieldOptions
  fieldsOrder?: ViewFieldsOrder
  pinnedFields?: ViewPinnedFields
  rowHeight?: ViewRowHeight
}

export interface IQueryView {
  id: string
  name: string
  showSystemFields?: boolean
  sorts?: ISorts
  kanban?: IKanbanSchema
  gallery?: IGallerySchema
  gantt?: IGanttSchema
  tree?: ITreeViewSchema
  calendar?: ICalendarSchema
  dashboard?: IDashboardSchema
  displayType: IViewDisplayType
  filter?: IRootFilter
  fieldOptions?: Record<string, IViewFieldOption>
  fieldsOrder?: string[]
  pinnedFields?: IViewPinnedFields
  rowHeight?: IViewRowHeight
}
export type IViewDisplayType = z.infer<typeof viewDisplayType>
export type ICreateViewInput_internal = z.infer<typeof createViewInput_internal>
