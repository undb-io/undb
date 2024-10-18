import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { viewDTO } from "../modules"
import { tableId } from "../table-id.vo"

const EVT_VIEW_CREATED = "view.created" as const

export const viewCreatedEventPayload = z.object({
  tableId,
  view: viewDTO,
})

export type IViewCreatedEventPayload = z.infer<typeof viewCreatedEventPayload>

export class ViewCreatedEvent extends BaseEvent<IViewCreatedEventPayload, typeof EVT_VIEW_CREATED> {
  name = EVT_VIEW_CREATED

  constructor(
    public readonly payload: IViewCreatedEventPayload,
    spaceId: string,
  ) {
    super(payload, undefined, spaceId)
  }
}
