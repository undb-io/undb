import { Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import { FieldConstraintVO, baseFieldConstraint } from "../../field-constraint.vo"

export const durationFieldConstraint = baseFieldConstraint
  .partial()
  .merge(
    z.object({
      min: z.number().int().nonnegative(),
      max: z.number().int().nonnegative(),
    }),
  )
  .partial()
  .refine((v) => v.min === undefined || v.max === undefined || v.min <= v.max, {
    message: "min should be less than or equal to max",
  })

export type IDurationFieldConstraint = z.infer<typeof durationFieldConstraint>

export class DurationFieldConstraint extends FieldConstraintVO<IDurationFieldConstraint> {
  constructor(dto: IDurationFieldConstraint) {
    super({
      required: dto.required,
      min: dto.min,
      max: dto.max,
    })
  }
  override get schema() {
    let base: z.ZodTypeAny = z.number().int().nonnegative()
    if (this.props.min) {
      base = base.and(z.number().min(this.props.min))
    }
    if (this.props.max) {
      base = base.and(z.number().max(this.props.max))
    }
    if (!this.props.required) {
      base = base.optional().nullable()
    }

    return base
  }

  override get mutateSchema() {
    return Some(this.schema)
  }

  override fromFormField(formField: FormFieldVO) {
    return new DurationFieldConstraint({
      ...this.props,
      required: this.props.required ?? formField.required,
    }) as this
  }
}
