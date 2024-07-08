import { z } from "@undb/zod"
import { recordId } from "../record-id.vo"

export const bulkdeleteRecordsDTO = z.object({
  ids: recordId.array().nonempty(),
})

export type IBulkDeleteRecordsDTO = z.infer<typeof bulkdeleteRecordsDTO>
