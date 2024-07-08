import { z } from "@undb/zod"
import { recordId } from "../record-id.vo"

export const bulkduplicateRecordsDTO = z.object({
  ids: recordId.array().nonempty(),
})

export type IBulkDuplicateRecordsDTO = z.infer<typeof bulkduplicateRecordsDTO>
