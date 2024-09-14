import { Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import { FieldConstraintVO, baseFieldConstraint } from "../../field-constraint.vo"
import { attachmentFieldValue } from "./attachment-field-value.vo"

export const attachmentFieldConstraint = z
  .object({
    min: z.number().int().nonnegative(),
    max: z.number().int().positive(),
  })
  .merge(baseFieldConstraint)
  .partial()
  .refine((v) => v.min === undefined || v.max === undefined || v.min <= v.max, {
    message: "min should be less than or equal to max",
  })

export type IAttachmentFieldConstraint = z.infer<typeof attachmentFieldConstraint>

export class AttachmentFieldConstraint extends FieldConstraintVO<IAttachmentFieldConstraint> {
  constructor(dto: IAttachmentFieldConstraint) {
    super({
      required: dto.required,
      max: dto.max,
    })
  }
  override get schema() {
    let base = attachmentFieldValue.unwrap()
    const { required, max } = this.props
    if (!required) {
      base = base.min(0)
    } else {
      base = base.min(1)
    }

    if (this.props.min) {
      base = base.min(this.props.min)
    }

    if (max) {
      base = base.max(max)
    }

    return required ? base : base.optional().nullable()
  }

  get mutateSchema() {
    return Some(this.schema)
  }

  override fromFormField(formField: FormFieldVO) {
    return new AttachmentFieldConstraint({
      ...this.props,
      required: this.props.required ?? formField.required,
    }) as this
  }
}
