import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { spaceDTO } from "../dto"

const EVT_SPACE_CREATED = "space.created" as const

export const spaceCreatedEventPayload = z.object({
  space: spaceDTO,
})

export type ISpaceCreatedEventPayload = z.infer<typeof spaceCreatedEventPayload>

export class SpaceCreatedEvent extends BaseEvent<ISpaceCreatedEventPayload, typeof EVT_SPACE_CREATED> {
  name = EVT_SPACE_CREATED

  constructor(
    public readonly payload: ISpaceCreatedEventPayload,
    spaceId: string,
  ) {
    super(payload, undefined, spaceId)
  }
}
