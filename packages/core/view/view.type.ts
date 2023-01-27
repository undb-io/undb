import type { z } from 'zod'
import type { IRootFilter } from '../filter'
import type { RootFilter } from '../filter/root-filter'
import type { Calendar, ICalendarSchema } from './calendar'
import type { IKanbanSchema, Kanban } from './kanban'
import type { ISorts } from './sort/sort.schema'
import type { Sorts } from './sort/sorts'
import type { ITreeViewSchema, TreeView } from './tree-view'
import type { IViewFieldOption, ViewFieldOptions } from './view-field-options'
import type { ViewFieldsOrder } from './view-fields-order.vo'
import type { ViewId } from './view-id.vo'
import type { ViewKey } from './view-key.vo'
import type { ViewName } from './view-name.vo'
import type { createViewInput_internal, viewDisplayType } from './view.schema'

export interface IView {
  id: ViewId
  key: ViewKey
  name: ViewName
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
  key: string
  name: string
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
