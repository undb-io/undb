import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { viewAggregate, viewId } from "../modules"
import { tableId } from "../table-id.vo"

const EVT_SET_VIEW_COLOR = "table.view.color.set" as const

export const setViewAggregateEventPayload = z.object({
  tableId: tableId,
  viewId: viewId,
  previous: viewAggregate.nullable(),
  aggregate: viewAggregate.nullable(),
})

export type ISetViewAggregateEventPayload = z.infer<typeof setViewAggregateEventPayload>

export class SetViewAggregateEvent extends BaseEvent<ISetViewAggregateEventPayload, typeof EVT_SET_VIEW_COLOR> {
  name = EVT_SET_VIEW_COLOR

  constructor(
    public readonly payload: ISetViewAggregateEventPayload,
    spaceId: string,
  ) {
    super(payload, undefined, spaceId)
  }
}
