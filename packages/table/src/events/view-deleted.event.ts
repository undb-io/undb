import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { viewId } from "../modules"
import { tableId } from "../table-id.vo"

const EVT_VIEW_DELETED = "view.deleted" as const

export const viewDeletedEventPayload = z.object({
  tableId,
  viewId,
})

export type IViewDeletedEventPayload = z.infer<typeof viewDeletedEventPayload>

export class ViewDeletedEvent extends BaseEvent<IViewDeletedEventPayload, typeof EVT_VIEW_DELETED> {
  name = EVT_VIEW_DELETED

  constructor(
    public readonly payload: IViewDeletedEventPayload,
    spaceId: string,
  ) {
    super(payload, undefined, spaceId)
  }
}
