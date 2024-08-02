import { ValueObject } from "@undb/domain"
import * as z from "@undb/zod"

export const spaceNameSchema = z.string().min(1)

export class SpaceName extends ValueObject<z.infer<typeof spaceNameSchema>> {
  static from(name: string): SpaceName {
    return new SpaceName({ value: name })
  }
}
