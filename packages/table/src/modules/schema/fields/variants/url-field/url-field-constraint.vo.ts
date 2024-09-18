import { Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import { FieldConstraintVO, baseFieldConstraint } from "../../field-constraint.vo"

export const urlFieldConstraint = baseFieldConstraint.partial()

export type IUrlFieldConstraint = z.infer<typeof urlFieldConstraint>

export class UrlFieldConstraint extends FieldConstraintVO<IUrlFieldConstraint> {
  constructor(dto: IUrlFieldConstraint) {
    super({
      required: dto.required,
    })
  }
  override get schema() {
    let base: z.ZodTypeAny = z.string().url()
    if (!this.props.required) {
      base = base.or(z.literal("")).optional().nullable()
    }

    return base
  }

  override get mutateSchema() {
    return Some(this.schema)
  }

  override fromFormField(formField: FormFieldVO) {
    return new UrlFieldConstraint({
      ...this.props,
      required: this.props.required ?? formField.required,
    }) as this
  }
}
