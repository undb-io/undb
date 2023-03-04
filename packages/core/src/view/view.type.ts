import type { z } from 'zod'
import type { IRootFilter } from '../filter/index.js'
import type { RootFilter } from '../filter/root-filter'
import type { Calendar, ICalendarSchema } from './calendar/index.js'
import type { IKanbanSchema, Kanban } from './kanban/index.js'
import type { ISorts } from './sort/sort.schema.js'
import type { Sorts } from './sort/sorts.js'
import type { ITreeViewSchema, TreeView } from './tree-view/index.js'
import type { IViewFieldOption, ViewFieldOptions } from './view-field-options.js'
import type { ViewFieldsOrder } from './view-fields-order.vo.js'
import type { ViewId } from './view-id.vo.js'
import type { ViewName } from './view-name.vo.js'
import type { createViewInput_internal, viewDisplayType } from './view.schema.js'

export interface IView {
  id: ViewId
  name: ViewName
  showSystemFields?: boolean
  sorts?: Sorts
  kanban?: Kanban
  calendar?: Calendar
  tree?: TreeView
  displayType: IViewDisplayType
  filter?: RootFilter
  fieldOptions: ViewFieldOptions
  fieldsOrder?: ViewFieldsOrder
}

export interface IQueryView {
  id: string
  name: string
  showSystemFields?: boolean
  sorts?: ISorts
  kanban?: IKanbanSchema
  tree?: ITreeViewSchema
  calendar?: ICalendarSchema
  displayType: IViewDisplayType
  filter?: IRootFilter
  fieldOptions?: Record<string, IViewFieldOption>
  fieldsOrder?: string[]
}
export type IViewDisplayType = z.infer<typeof viewDisplayType>
export type ICreateViewInput_internal = z.infer<typeof createViewInput_internal>
