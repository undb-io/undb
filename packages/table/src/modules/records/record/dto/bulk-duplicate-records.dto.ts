import { z } from "@undb/zod"
import { viewFilterGroup } from "../../../views"

export const bulkDuplicateRecordsDTO = z.object({
  filter: viewFilterGroup,
  isOpenapi: z.boolean().optional(),
})

export type IBulkDuplicateRecordsDTO = z.infer<typeof bulkDuplicateRecordsDTO>
