import { z } from "@undb/zod"
import { recordId } from "../record-id.vo"

export const duplicateRecordDTO = z.object({
  id: recordId,
})

export type IDuplicateRecordDTO = z.infer<typeof duplicateRecordDTO>
