import { Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { FormFieldVO } from "../../../../forms"
import { FieldConstraintVO, baseFieldConstraint } from "../../field-constraint.vo"

export const referenceFieldConstraint = z
  .object({
    min: z.number().int().nonnegative(),
    max: z.number().int().positive(),
  })
  .merge(baseFieldConstraint)
  .partial()
  .refine((v) => v.min === undefined || v.max === undefined || v.min <= v.max, {
    message: "min should be less than or equal to max",
  })

export type IReferenceFieldConstraint = z.infer<typeof referenceFieldConstraint>

export class ReferenceFieldConstraint extends FieldConstraintVO<IReferenceFieldConstraint> {
  constructor(dto: IReferenceFieldConstraint) {
    super({
      max: dto.max,
      min: dto.min,
      required: dto.required,
    })
  }
  override get schema() {
    let base: z.ZodTypeAny = z.string().array()
    if (this.props.min) {
      base = base.and(z.string().array().min(this.props.min))
    }
    if (this.props.max) {
      base = base.and(z.string().array().max(this.props.max))
    }
    if (!this.props.required) {
      base = base.optional().nullable()
    }

    return base
  }

  get mutateSchema() {
    return Some(this.schema)
  }

  fromFormField(formField: FormFieldVO): this {
    return new ReferenceFieldConstraint({
      ...this.props,
      required: this.props.required || formField.required,
    }) as this
  }
}
