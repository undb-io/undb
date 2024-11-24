import { Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import { FieldConstraintVO, baseFieldConstraint } from "../../field-constraint.vo"
import { jsonSchemaValue } from "./json-field-value.vo"

export const jsonFieldConstraint = z
  .object({
    // min: z.number().int().positive(),
    // max: z.number().int().positive(),
  })
  .merge(baseFieldConstraint)
  .partial()

export type IJsonFieldConstraint = z.infer<typeof jsonFieldConstraint>

export class JsonFieldConstraint extends FieldConstraintVO<IJsonFieldConstraint> {
  constructor(dto: IJsonFieldConstraint) {
    super({
      required: dto.required,
    })
  }
  override get schema() {
    let base: z.ZodTypeAny = jsonSchemaValue

    if (!this.props.required) {
      base = base.optional().nullable()
    }

    return base
  }

  override get mutateSchema() {
    return Some(this.schema)
  }

  override fromFormField(formField: FormFieldVO) {
    return new JsonFieldConstraint({
      required: this.props.required ?? formField.required,
    }) as this
  }
}
