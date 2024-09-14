import { Some } from "@undb/domain"
import { z, type ZodTypeAny } from "@undb/zod"
import type { FormFieldVO } from "../../../../forms"
import { FieldConstraintVO, baseFieldConstraint } from "../../field-constraint.vo"

export const userFieldConstraint = z
  .object({
    min: z.number().int().nonnegative(),
    max: z.number().int().positive(),
  })
  .merge(baseFieldConstraint)
  .partial()
  .refine((v) => v.min === undefined || v.max === undefined || v.min <= v.max, {
    message: "min should be less than or equal to max",
  })

export type IUserFieldConstraint = z.infer<typeof userFieldConstraint>

export class UserFieldConstraint extends FieldConstraintVO<IUserFieldConstraint> {
  constructor(dto: IUserFieldConstraint) {
    super({
      min: dto.min,
      max: dto.max,
      required: dto.required,
    })
  }

  public get isSingle() {
    return this.props.max === 1
  }

  override get schema() {
    if (this.isSingle) {
      let base: ZodTypeAny = z.string()

      if (!this.props.required) {
        base = base.optional().nullable()
      }

      return base
    }

    let base = z.string().array()

    if (this.props.required) {
      base = base.min(1)
    }

    if (this.props.min) {
      base = base.min(this.props.min)
    }

    if (this.props.max) {
      base = base.max(this.props.max)
    }

    return this.props.required ? base : base.optional().nullable()
  }

  get mutateSchema() {
    return Some(this.schema)
  }

  override fromFormField(formField: FormFieldVO): this {
    return new UserFieldConstraint({
      ...this.props,
      required: this.props.required ?? formField.required,
    }) as this
  }
}
