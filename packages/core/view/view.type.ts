import type { z } from 'zod'
import type { IRootFilter } from '../filter'
import type { RootFilter } from '../filter/root-filter'
import type { Kanban } from './kanban'
import type { IKanbanSchema } from './kanban.schema'
import type { IViewFieldOption, ViewFieldOptions } from './view-field-options'
import type { ViewFieldsOrder } from './view-fields-order.vo'
import type { ViewName } from './view-name.vo'
import type { createViewInput_internal, viewDisplayType } from './view.schema'

export interface IView {
  name: ViewName
  kanban?: Kanban
  displayType: IViewDisplayType
  filter?: RootFilter
  fieldOptions: ViewFieldOptions
  fieldsOrder?: ViewFieldsOrder
}

export interface IQueryView {
  name: string
  kanban?: IKanbanSchema
  displayType: IViewDisplayType
  filter?: IRootFilter
  fieldOptions?: Record<string, IViewFieldOption>
  fieldsOrder?: string[]
}
export type IViewDisplayType = z.infer<typeof viewDisplayType>
export type ICreateViewInput_internal = z.infer<typeof createViewInput_internal>
