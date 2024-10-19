import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { baseDTO } from "../dto"

const EVT_BASE_UPDATED = "base.updated" as const

export const baseUpdatedEventPayload = z.object({
  previous: baseDTO,
  base: baseDTO,
})

export type IBaseUpdatedEventPayload = z.infer<typeof baseUpdatedEventPayload>

export class BaseUpdatedEvent extends BaseEvent<IBaseUpdatedEventPayload, typeof EVT_BASE_UPDATED> {
  name = EVT_BASE_UPDATED

  constructor(public readonly payload: IBaseUpdatedEventPayload, spaceId: string  ) {
    super(payload, undefined, spaceId)
  }
}
