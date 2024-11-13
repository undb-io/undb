import { z } from "@undb/zod"
import { fieldId } from "../../../schema/fields/field-id.vo"
import { fieldName } from "../../../schema/fields/field-name.vo"
import { recordId } from "../record-id.vo"

export const triggerRecordButtonDTO = z.object({
  recordId,
  field: fieldId.or(fieldName),
})

export type ITriggerRecordButtonDTO = z.infer<typeof triggerRecordButtonDTO>
