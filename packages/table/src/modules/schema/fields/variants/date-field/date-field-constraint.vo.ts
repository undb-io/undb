import { Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import { FieldConstraintVO, baseFieldConstraint } from "../../field-constraint.vo"
import { dateFieldMacroSchema } from "./date-field-macro"

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
    let base: z.ZodTypeAny = z
      .string()
      .date()
      .or(z.string().datetime())
      .or(z.string().date())
      .or(z.date())
      .or(dateFieldMacroSchema)
    if (!this.props.required) {
      base = base.optional().nullable()
    }

    return base
  }

  override get mutateSchema() {
    return Some(this.schema)
  }

  override fromFormField(formField: FormFieldVO) {
    return new DateFieldConstraint({
      ...this.props,
      required: this.props.required ?? formField.required,
    }) as this
  }
}
