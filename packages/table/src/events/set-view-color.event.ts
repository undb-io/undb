import { BaseEvent } from "@undb/domain"
import { z } from "zod"
import { filterGroup, viewId } from "../modules"
import { tableId } from "../table-id.vo"

const EVT_SET_VIEW_COLOR = "table.view.color.set" as const

export const setViewColorEventPayload = z.object({
  tableId: tableId,
  viewId: viewId,
  color: filterGroup.nullable(),
})

export type ISetViewColorEventPayload = z.infer<typeof setViewColorEventPayload>

export class SetViewColorEvent extends BaseEvent<ISetViewColorEventPayload, typeof EVT_SET_VIEW_COLOR> {
  name = EVT_SET_VIEW_COLOR

  constructor(public readonly payload: ISetViewColorEventPayload) {
    super(payload, undefined)
  }
}
