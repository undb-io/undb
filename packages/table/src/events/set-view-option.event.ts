import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { viewId, viewOption } from "../modules"
import { tableId } from "../table-id.vo"

const EVT_SET_VIEW_OPTION = "table.view.option.set" as const

export const setViewOptionEventPayload = z.object({
  tableId: tableId,
  viewId: viewId,
  previous: viewOption.nullable(),
  option: viewOption.nullable(),
})

export type ISetViewOptionEventPayload = z.infer<typeof setViewOptionEventPayload>

export class SetViewOptionEvent extends BaseEvent<ISetViewOptionEventPayload, typeof EVT_SET_VIEW_OPTION> {
  name = EVT_SET_VIEW_OPTION

  constructor(
    public readonly payload: ISetViewOptionEventPayload,
    spaceId: string,
  ) {
    super(payload, undefined, spaceId)
  }
}
