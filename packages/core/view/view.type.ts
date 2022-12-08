import type { z } from 'zod'
import type { ViewName } from './view-name.vo'
import type { createViewInput_internal, viewDisplayType } from './view.schema'

export interface IView {
  name: ViewName
  displayType: IViewDisplayType
}

export interface IQueryView {
  name: string
  displayType: IViewDisplayType
}
export type IViewDisplayType = z.infer<typeof viewDisplayType>
export type ICreateViewInput_internal = z.infer<typeof createViewInput_internal>
