import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { viewId, viewSort } from "../modules"
import { tableId } from "../table-id.vo"

const EVT_SET_VIEW_SORT = "table.view.sort.set" as const

export const setViewSortEventPayload = z.object({
  tableId: tableId,
  viewId: viewId,
  previous: viewSort.nullable(),
  sort: viewSort.nullable(),
})

export type ISetViewSortEventPayload = z.infer<typeof setViewSortEventPayload>

export class SetViewSortEvent extends BaseEvent<ISetViewSortEventPayload, typeof EVT_SET_VIEW_SORT> {
  name = EVT_SET_VIEW_SORT

  constructor(
    public readonly payload: ISetViewSortEventPayload,
    spaceId: string,
  ) {
    super(payload, undefined, spaceId)
  }
}
