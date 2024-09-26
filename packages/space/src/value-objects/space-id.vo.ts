import { NanoID } from "@undb/domain"
import { z } from "@undb/zod"

export const spaceIdSchema = z.string()

export type ISpaceId = z.infer<typeof spaceIdSchema>

export class SpaceId extends NanoID {
  private static SPACE_ID_PREFIX = "spa"
  private static SPACE_ID_SIZE = 5

  static create(): SpaceId {
    const id = NanoID.createId(SpaceId.SPACE_ID_PREFIX, SpaceId.SPACE_ID_SIZE)
    return new SpaceId(id)
  }

  static createId(): string {
    return this.create().value
  }

  static from(id: string): SpaceId {
    return new SpaceId(id)
  }

  static fromOrCreate(id?: string): SpaceId {
    if (!id) {
      return SpaceId.create()
    }
    return SpaceId.from(id)
  }
}
