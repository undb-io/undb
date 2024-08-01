import { recordId } from "@undb/table"
import { z } from "@undb/zod"

export const getRecordAuditsDTO = z.object({
  recordId: recordId,
})
