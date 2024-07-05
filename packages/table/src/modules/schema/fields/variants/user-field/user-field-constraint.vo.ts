import { z, type ZodTypeAny } from "@undb/zod"
import { FieldConstraintVO, baseFieldConstraint } from "../../field-constraint.vo"

export const userFieldConstraint = z
  .object({
    // min: z.number().int().positive(),
    // max: z.number().int().positive(),
  })
  .merge(baseFieldConstraint)
  .partial()

export type IUserFieldConstraint = z.infer<typeof userFieldConstraint>

export class UserFieldConstraint extends FieldConstraintVO<IUserFieldConstraint> {
  constructor(dto: IUserFieldConstraint) {
    super({
      required: dto.required,
    })
  }
  override get schema() {
    let base: ZodTypeAny = z.string()

    if (!this.props.required) {
      base = base.optional().nullable()
    }

    return base
  }
}
