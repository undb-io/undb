import { z } from "@undb/zod"
import { FieldConstraintVO, baseFieldConstraint } from "../../field-constraint.vo"

export const dateFieldConstraint = z
  .object({
    // min: z.number().int().positive(),
    // max: z.number().int().positive(),
  })
  .merge(baseFieldConstraint)
  .partial()

export type IDateFieldConstraint = z.infer<typeof dateFieldConstraint>

export class DateFieldConstraint extends FieldConstraintVO<IDateFieldConstraint> {
  constructor(dto: IDateFieldConstraint) {
    super({
      required: dto.required,
    })
  }
  override get schema() {
    let base: z.ZodTypeAny = z.string().date().or(z.string().datetime())
    if (!this.props.required) {
      base = base.optional().nullable()
    }

    return base
  }
}
