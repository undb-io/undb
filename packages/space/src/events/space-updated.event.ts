import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { spaceDTO } from "../dto"

const EVT_SPACE_UPDATED = "space.updated" as const

export const spaceUpdatedEventPayload = z.object({
  previous: spaceDTO,
  space: spaceDTO,
})

export type ISpaceUpdatedEventPayload = z.infer<typeof spaceUpdatedEventPayload>

export class SpaceUpdatedEvent extends BaseEvent<ISpaceUpdatedEventPayload, typeof EVT_SPACE_UPDATED> {
  name = EVT_SPACE_UPDATED

  constructor(
    public readonly payload: ISpaceUpdatedEventPayload,
    spaceId: string,
  ) {
    super(payload, undefined, spaceId)
  }
}
