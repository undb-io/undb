import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { baseDTO } from "../dto"

const EVT_BASE_CREATED = "base.created" as const

export const baseCreatedEventPayload = z.object({
  base: baseDTO,
})

export type IBaseCreatedEventPayload = z.infer<typeof baseCreatedEventPayload>

export class BaseCreatedEvent extends BaseEvent<IBaseCreatedEventPayload, typeof EVT_BASE_CREATED> {
  name = EVT_BASE_CREATED

  constructor(
    public readonly payload: IBaseCreatedEventPayload,
    spaceId: string,
  ) {
    super(payload, undefined, spaceId)
  }
}
