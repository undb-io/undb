import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"

export const baseOptionSchema = z.object({})

export type IBaseOption = z.infer<typeof baseOptionSchema>

export class BaseOption extends ValueObject<IBaseOption> {
  constructor(props: IBaseOption) {
    super(props)
  }

  toJSON() {
    return {}
  }
}
