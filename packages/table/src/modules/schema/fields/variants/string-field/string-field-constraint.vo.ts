import { Option, Some, andOptions } from "@undb/domain"
import { z } from "zod"
import type { RecordComositeSpecification } from "../../../../records"
import { FieldConstraintVO, baseFieldConstraint } from "../../field-constraint.vo"
import type { FieldId } from "../../field-id.vo"
import { StringEmpty } from "./string-field-value.specification"

export const stringFieldConstraint = z
  .object({
    min: z.number().int().positive(),
    max: z.number().int().positive(),
  })
  .merge(baseFieldConstraint)
  .partial()

export type IStringFieldConstraint = z.infer<typeof stringFieldConstraint>

export class StringFieldConstraint extends FieldConstraintVO<IStringFieldConstraint> {
  getSpec(fieldId: FieldId) {
    const specs: Option<RecordComositeSpecification>[] = []

    if (this.required) {
      //  TODO: fix as unknown
      specs.push(Some(new StringEmpty(fieldId).not() as unknown as RecordComositeSpecification))
    }

    return andOptions(...specs) as Option<RecordComositeSpecification>
  }
}
