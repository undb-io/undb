import { z } from "zod"
import { FieldConstraintVO, baseFieldConstraint } from "../../field-constraint.vo"

export const stringFieldConstraint = z
  .object({
    min: z.number().int().positive(),
    max: z.number().int().positive(),
  })
  .merge(baseFieldConstraint)
  .partial()

export type IStringFieldConstraint = z.infer<typeof stringFieldConstraint>

export class StringFieldConstraint extends FieldConstraintVO<IStringFieldConstraint> {
  override get schema() {
    let base: z.ZodTypeAny = z.string()
    if (!this.props.required) {
      base = base.optional()
    }
    if (this.props.min) {
      base = base.and(z.string().min(this.props.min))
    }
    if (this.props.max) {
      base = base.and(z.string().max(this.props.max))
    }

    return base
  }
}
