import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { viewId } from "../modules"
import { viewColorGroup } from "../modules/views/view/view-color"
import { tableId } from "../table-id.vo"

const EVT_SET_VIEW_COLOR = "table.view.color.set" as const

export const setViewColorEventPayload = z.object({
  tableId: tableId,
  viewId: viewId,
  previous: viewColorGroup.nullable(),
  color: viewColorGroup.nullable(),
})

export type ISetViewColorEventPayload = z.infer<typeof setViewColorEventPayload>

export class SetViewColorEvent extends BaseEvent<ISetViewColorEventPayload, typeof EVT_SET_VIEW_COLOR> {
  name = EVT_SET_VIEW_COLOR

  constructor(
    public readonly payload: ISetViewColorEventPayload,
    spaceId: string,
  ) {
    super(payload, undefined, spaceId)
  }
}
