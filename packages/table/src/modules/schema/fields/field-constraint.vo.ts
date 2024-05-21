import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"

export const baseFieldConstraint = z.object({
  required: z.boolean().optional(),
})

export type IBaseFieldConstraint = z.infer<typeof baseFieldConstraint>

export abstract class FieldConstraintVO<C extends IBaseFieldConstraint = any> extends ValueObject<C> {
  public get required() {
    return !!this.props.required
  }

  abstract get schema(): z.ZodTypeAny
}
