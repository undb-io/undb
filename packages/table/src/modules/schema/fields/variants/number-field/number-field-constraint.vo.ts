import { Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import { FieldConstraintVO, baseFieldConstraint } from "../../field-constraint.vo"

export const numberFieldConstraint = z
  .object({
    min: z.number(),
    max: z.number(),
    isInt: z.boolean(),
  })
  .merge(baseFieldConstraint)
  .partial()
  .refine((v) => v.min === undefined || v.max === undefined || v.min <= v.max, {
    message: "min should be less than or equal to max",
  })

export type INumberFieldConstraint = z.infer<typeof numberFieldConstraint>

export class NumberFieldConstraint extends FieldConstraintVO<INumberFieldConstraint> {
  constructor(dto: INumberFieldConstraint) {
    super({
      max: dto.max,
      min: dto.min,
      required: dto.required,
      isInt: dto.isInt,
    })
  }
  override get schema() {
    let base: z.ZodTypeAny = z.number()
    if (this.props.min) {
      base = base.and(
        z.number().min(this.props.min, { message: `min should be greater than or equal to ${this.props.min}` }),
      )
    }
    if (this.props.max) {
      base = base.and(
        z.number().max(this.props.max, { message: `max should be less than or equal to ${this.props.max}` }),
      )
    }
    if (this.props.isInt) {
      base = base.and(z.number().int())
    }
    if (!this.props.required) {
      base = base.optional().nullable()
    }

    return base
  }

  get mutateSchema() {
    return Some(this.schema)
  }

  override fromFormField(formField: FormFieldVO) {
    return new NumberFieldConstraint({
      ...this.props,
      required: this.props.required ?? formField.required,
    }) as this
  }
}
