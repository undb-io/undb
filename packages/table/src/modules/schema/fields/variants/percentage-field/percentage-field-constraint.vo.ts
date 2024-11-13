import { Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import { FieldConstraintVO, baseFieldConstraint } from "../../field-constraint.vo"

export const percentageFieldConstraint = baseFieldConstraint
  .partial()
  .merge(
    z.object({
      min: z.number().nonnegative(),
      max: z.number().nonnegative(),
    }),
  )
  .partial()
  .refine((v) => v.min === undefined || v.max === undefined || v.min <= v.max, {
    message: "min should be less than or equal to max",
  })

export type IPercentageFieldConstraint = z.infer<typeof percentageFieldConstraint>

export class PercentageFieldConstraint extends FieldConstraintVO<IPercentageFieldConstraint> {
  constructor(dto: IPercentageFieldConstraint) {
    super({
      required: dto.required,
      min: dto.min,
      max: dto.max,
    })
  }
  override get schema() {
    let base: z.ZodTypeAny = z.number().nonnegative()
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
    return new PercentageFieldConstraint({
      ...this.props,
      required: this.props.required ?? formField.required,
    }) as this
  }
}
