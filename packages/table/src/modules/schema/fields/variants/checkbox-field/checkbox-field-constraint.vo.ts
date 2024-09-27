import { Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import { FieldConstraintVO } from "../../field-constraint.vo"

export const checkboxFieldConstraint = z.object({})

export type ICheckboxFieldConstraint = z.infer<typeof checkboxFieldConstraint>

export class CheckboxFieldConstraint extends FieldConstraintVO<ICheckboxFieldConstraint> {
  constructor(dto: ICheckboxFieldConstraint) {
    super({})
  }
  override get schema() {
    let base: z.ZodTypeAny = z.boolean().optional().nullable()

    return base
  }

  override get mutateSchema() {
    return Some(this.schema)
  }

  override fromFormField(formField: FormFieldVO) {
    return new CheckboxFieldConstraint({}) as this
  }
}
