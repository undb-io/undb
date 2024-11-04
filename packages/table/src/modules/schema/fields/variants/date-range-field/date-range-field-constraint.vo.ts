import { Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import { FieldConstraintVO, baseFieldConstraint } from "../../field-constraint.vo"

export const daterangeFieldConstraint = z
  .object({
    // min: z.number().int().positive(),
    // max: z.number().int().positive(),
  })
  .merge(baseFieldConstraint)
  .partial()

export type IDateRangeFieldConstraint = z.infer<typeof daterangeFieldConstraint>

export class DateRangeFieldConstraint extends FieldConstraintVO<IDateRangeFieldConstraint> {
  constructor(dto: IDateRangeFieldConstraint) {
    super({
      required: dto.required,
    })
  }
  override get schema() {
    let date: z.ZodTypeAny = z.date().or(z.string().datetime()).or(z.string().date()).nullable().optional()
    let base = z.tuple([date, date]).refine((value) => !!value?.[0] || !!value?.[1], {
      message: "At least one date must be set",
    })
    if (this.props.required) {
      return base
    } else {
      return base.optional().nullable()
    }
  }

  override get mutateSchema() {
    return Some(this.schema)
  }

  override fromFormField(formField: FormFieldVO) {
    return new DateRangeFieldConstraint({
      ...this.props,
      required: this.props.required ?? formField.required,
    }) as this
  }
}
