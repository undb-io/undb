import { ValueObject } from "@undb/domain"
import * as z from "@undb/zod"

export const spaceAvatarSchema = z.string().url().nullable()

export class SpaceAvatar extends ValueObject<z.infer<typeof spaceAvatarSchema>> {
  static from(name: string | undefined): SpaceAvatar {
    return new SpaceAvatar({ value: name ?? null })
  }
}
