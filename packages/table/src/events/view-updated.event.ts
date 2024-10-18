import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { viewDTO } from "../modules"
import { tableId } from "../table-id.vo"

const EVT_VIEW_UPDATED = "view.updated" as const

export const viewUpdatedEventPayload = z.object({
  tableId,
  previous: viewDTO.optional(),
  view: viewDTO,
})

export type IViewUpdatedEventPayload = z.infer<typeof viewUpdatedEventPayload>

export class ViewUpdatedEvent extends BaseEvent<IViewUpdatedEventPayload, typeof EVT_VIEW_UPDATED> {
  name = EVT_VIEW_UPDATED

  constructor(
    public readonly payload: IViewUpdatedEventPayload,
    spaceId: string,
  ) {
    super(payload, undefined, spaceId)
  }
}
