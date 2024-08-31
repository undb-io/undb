import { z } from "@undb/zod"
import { fieldId, fieldName } from "../../../schema"
import { recordId } from "../record-id.vo"

export const triggerRecordButtonDTO = z.object({
  recordId,
  field: fieldId.or(fieldName),
})

export type ITriggerRecordButtonDTO = z.infer<typeof triggerRecordButtonDTO>
