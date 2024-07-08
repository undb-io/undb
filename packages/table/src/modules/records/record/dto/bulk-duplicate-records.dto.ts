import { z } from "@undb/zod"
import { recordId } from "../record-id.vo"

export const bulkDuplicateRecordsDTO = z.object({
  ids: recordId.array().nonempty(),
})

export type IBulkDuplicateRecordsDTO = z.infer<typeof bulkDuplicateRecordsDTO>
