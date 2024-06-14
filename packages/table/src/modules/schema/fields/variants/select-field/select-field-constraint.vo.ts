import { z } from "@undb/zod"
import { FieldConstraintVO, baseFieldConstraint } from "../../field-constraint.vo"
import { optionName } from "../../option"

export const selectFieldConstraint = baseFieldConstraint.partial()

export type ISelectFieldConstraint = z.infer<typeof selectFieldConstraint>

export class SelectFieldConstraint extends FieldConstraintVO<ISelectFieldConstraint> {
  constructor(dto: ISelectFieldConstraint) {
    super({ required: dto.required })
  }
  override get schema() {
    let base: z.ZodTypeAny = optionName
    if (!this.props.required) {
      base = base.optional().nullable()
    }

    return base
  }
}
