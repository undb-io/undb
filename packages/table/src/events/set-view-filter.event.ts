import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { viewFilterGroup, viewId } from "../modules"
import { tableId } from "../table-id.vo"

const EVT_SET_VIEW_FILTER = "table.view.filter.set" as const

export const setViewFilterEventPayload = z.object({
  tableId: tableId,
  viewId: viewId,
  previous: viewFilterGroup.nullable(),
  filter: viewFilterGroup.nullable(),
})

export type ISetViewFilterEventPayload = z.infer<typeof setViewFilterEventPayload>

export class SetViewFilterEvent extends BaseEvent<ISetViewFilterEventPayload, typeof EVT_SET_VIEW_FILTER> {
  name = EVT_SET_VIEW_FILTER

  constructor(
    public readonly payload: ISetViewFilterEventPayload,
    spaceId: string,
  ) {
    super(payload, undefined, spaceId)
  }
}
