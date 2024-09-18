import { Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { FormFieldVO } from "../../../../forms"
import { FieldConstraintVO, baseFieldConstraint } from "../../field-constraint.vo"

export const stringFieldConstraint = z
  .object({
    min: z.number().int().nonnegative(),
    max: z.number().int().positive(),
  })
  .merge(baseFieldConstraint)
  .partial()
  .refine((v) => v.min === undefined || v.max === undefined || v.min <= v.max, {
    message: "min should be less than or equal to max",
  })

export type IStringFieldConstraint = z.infer<typeof stringFieldConstraint>

export class StringFieldConstraint extends FieldConstraintVO<IStringFieldConstraint> {
  constructor(dto: IStringFieldConstraint) {
    super({
      max: dto.max,
      min: dto.min,
      required: dto.required,
    })
  }
  override get schema() {
    let base: z.ZodTypeAny = z.string()
    if (!this.props.required) {
      base = base.or(z.literal("")).optional().nullable()
    }
    if (this.props.min) {
      base = base.and(z.string().min(this.props.min))
    }
    if (this.props.max) {
      base = base.and(z.string().max(this.props.max))
    }

    return base
  }

  override get mutateSchema() {
    return Some(this.schema)
  }

  fromFormField(formField: FormFieldVO) {
    return new StringFieldConstraint({
      ...this.props,
      required: this.props.required ?? formField.required,
    }) as this
  }
}
