import { z } from "@undb/zod"
import { FieldConstraintVO, baseFieldConstraint } from "../../field-constraint.vo"

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
    const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
    let base: z.ZodTypeAny = z.lazy(() => z.union([literalSchema, z.array(base), z.record(base)]))

    if (!this.props.required) {
      base = base.optional().nullable()
    }

    return base
  }
}
