import type { z } from 'zod'
import type { IRootFilter } from '../filter'
import type { RootFilter } from '../filter/filters'
import type { ViewName } from './view-name.vo'
import type { createViewInput_internal, viewDisplayType } from './view.schema'

export interface IView {
  name: ViewName
  displayType: IViewDisplayType
  filter?: RootFilter
}

export interface IQueryView {
  name: string
  displayType: IViewDisplayType
  filter?: IRootFilter
}
export type IViewDisplayType = z.infer<typeof viewDisplayType>
export type ICreateViewInput_internal = z.infer<typeof createViewInput_internal>
