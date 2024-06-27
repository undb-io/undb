import { z } from "@undb/zod"
import { FieldConstraintVO, baseFieldConstraint } from "../../field-constraint.vo"
import { attachmentFieldValue } from "./attachment-field-value.vo"

export const attachmentFieldConstraint = baseFieldConstraint.partial()

export type IAttachmentFieldConstraint = z.infer<typeof attachmentFieldConstraint>

export class AttachmentFieldConstraint extends FieldConstraintVO<IAttachmentFieldConstraint> {
  constructor(dto: IAttachmentFieldConstraint) {
    super({
      required: dto.required,
    })
  }
  override get schema() {
    let base = attachmentFieldValue
    if (!this.props.required) {
      base = base.min(0)
    } else {
      base = base.min(1)
    }

    return base
  }
}
