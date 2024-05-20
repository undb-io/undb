import { Option, ValueObject } from "@undb/domain"
import { z } from "zod"
import type { RecordComositeSpecification } from "../../records"
import type { FieldId } from "./field-id.vo"

export const baseFieldConstraint = z.object({
  required: z.boolean().optional(),
})

export type IBaseFieldConstraint = z.infer<typeof baseFieldConstraint>

export abstract class FieldConstraintVO<C extends IBaseFieldConstraint> extends ValueObject<C> {
  public get required() {
    return !!this.props.required
  }

  abstract getSpec(fieldId: FieldId): Option<RecordComositeSpecification>
}
