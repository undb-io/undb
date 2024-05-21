import { z } from "zod"
import { FieldConstraintVO, baseFieldConstraint } from "../../field-constraint.vo"

export const numberFieldConstraint = z
  .object({
    min: z.number().int().positive(),
    max: z.number().int().positive(),
    isInt: z.boolean(),
  })
  .merge(baseFieldConstraint)
  .partial()

export type INumberFieldConstraint = z.infer<typeof numberFieldConstraint>

export class NumberFieldConstraint extends FieldConstraintVO<INumberFieldConstraint> {
  override get schema() {
    let base: z.ZodTypeAny = z.number()
    if (!this.props.required) {
      base = base.optional().nullable()
    }
    if (this.props.min) {
      base = base.and(z.number().min(this.props.min))
    }
    if (this.props.max) {
      base = base.and(z.number().max(this.props.max))
    }
    if (this.props.isInt) {
      base = base.and(z.number().int())
    }

    return base
  }
}
