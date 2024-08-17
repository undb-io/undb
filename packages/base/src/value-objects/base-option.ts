import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"

export const baseOptionSchema = z.object({
  allowTemplate: z.boolean().optional(),
})

export type IBaseOption = z.infer<typeof baseOptionSchema>

export class BaseOption extends ValueObject<IBaseOption> {
  public readonly allowTemplate: boolean

  constructor(props: IBaseOption) {
    super(props)
    this.allowTemplate = props.allowTemplate ?? false
  }

  toJSON() {
    return {
      allowTemplate: this.allowTemplate,
    }
  }
}
