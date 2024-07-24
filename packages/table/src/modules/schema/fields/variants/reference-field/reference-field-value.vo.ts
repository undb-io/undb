import { z } from "@undb/zod"
import { isEmpty } from "radash"
import { recordId } from "../../../../records/record/record-id.vo"
import { fieldId } from "../../field-id.vo"
import { FieldValueObject } from "../../field-value"

const referenceFieldValueItem = recordId
export const referenceFieldValue = referenceFieldValueItem.array().nullable().optional()
export type IReferenceFieldValue = z.infer<typeof referenceFieldValue>

const referenceFieldDisplayValue = z.record(fieldId, z.string().array().nullable())
export type IReferenceFieldDisplayValue = z.infer<typeof referenceFieldDisplayValue>

export const mutateReferenceFieldValueSchema = z.union([
  referenceFieldValueItem.array().optional().nullable(),
  z.object({
    type: z.literal("set"),
    value: referenceFieldValueItem.array().nullable(),
  }),
  z.object({
    type: z.literal("append"),
    value: referenceFieldValueItem.array().nullable().or(referenceFieldValueItem),
  }),
  z.object({
    type: z.literal("prepend"),
    value: referenceFieldValueItem.array().nullable().or(referenceFieldValueItem),
  }),
])

export type IMutateReferenceFieldValueSchema = z.infer<typeof mutateReferenceFieldValueSchema>

export class ReferenceFieldValue extends FieldValueObject<IReferenceFieldValue> {
  constructor(value: IReferenceFieldValue) {
    super(!value ? { value: null } : value)
  }

  isEmpty() {
    return isEmpty(this.props)
  }
}
