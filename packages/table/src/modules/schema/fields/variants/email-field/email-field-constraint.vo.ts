import { Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import { FieldConstraintVO, baseFieldConstraint } from "../../field-constraint.vo"

export const emailFieldConstraint = baseFieldConstraint.partial()

export type IEmailFieldConstraint = z.infer<typeof emailFieldConstraint>

export class EmailFieldConstraint extends FieldConstraintVO<IEmailFieldConstraint> {
  constructor(dto: IEmailFieldConstraint) {
    super({
      required: dto.required,
    })
  }
  override get schema() {
    let base: z.ZodTypeAny = z.string().email()
    if (!this.props.required) {
      base = base.or(z.literal("")).optional().nullable()
    }

    return base
  }

  override get mutateSchema() {
    return Some(this.schema)
  }

  override fromFormField(formField: FormFieldVO) {
    return new EmailFieldConstraint({
      required: this.props.required || formField.required,
    }) as this
  }
}
