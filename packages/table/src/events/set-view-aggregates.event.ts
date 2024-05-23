import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { viewAggregate, viewId } from "../modules"
import { tableId } from "../table-id.vo"

const EVT_SET_VIEW_COLOR = "table.view.color.set" as const

export const setViewAggregatesEventPayload = z.object({
  tableId: tableId,
  viewId: viewId,
  previous: viewAggregate.nullable(),
  aggregates: viewAggregate.nullable(),
})

export type ISetViewAggregatesEventPayload = z.infer<typeof setViewAggregatesEventPayload>

export class SetViewAggregatesEvent extends BaseEvent<ISetViewAggregatesEventPayload, typeof EVT_SET_VIEW_COLOR> {
  name = EVT_SET_VIEW_COLOR

  constructor(public readonly payload: ISetViewAggregatesEventPayload) {
    super(payload, undefined)
  }
}
