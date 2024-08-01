import { Some } from "@undb/domain"
import { z } from "@undb/zod"
import { FieldConstraintVO, baseFieldConstraint } from "../../field-constraint.vo"

export const ratingFieldConstraint = z
  .object({
    min: z.number().int().nonnegative(),
    max: z.number().int().positive(),
  })
  .merge(baseFieldConstraint)
  .partial()
  .refine((v) => v.min === undefined || v.max === undefined || v.min <= v.max, {
    message: "min should be less than or equal to max",
  })

export type IRatingFieldConstraint = z.infer<typeof ratingFieldConstraint>

export class RatingFieldConstraint extends FieldConstraintVO<IRatingFieldConstraint> {
  constructor(dto: IRatingFieldConstraint) {
    super({
      max: dto.max,
      min: dto.min,
      required: dto.required,
    })
  }
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

    return base
  }

  get mutateSchema() {
    return Some(this.schema)
  }
}
