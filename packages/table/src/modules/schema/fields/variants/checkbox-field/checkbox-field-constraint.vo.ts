import { z } from "@undb/zod"
import { FieldConstraintVO } from "../../field-constraint.vo"

export const checkboxFieldConstraint = z.object({})

export type ICheckboxFieldConstraint = z.infer<typeof checkboxFieldConstraint>

export class CheckboxFieldConstraint extends FieldConstraintVO<ICheckboxFieldConstraint> {
  constructor(dto: ICheckboxFieldConstraint) {
    super({})
  }
  override get schema() {
    let base: z.ZodTypeAny = z.boolean().optional()

    return base
  }
}
