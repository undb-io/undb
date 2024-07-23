import { z } from "@undb/zod"
import { viewFilterGroup } from "../../../views"

export const bulkDeleteRecordsDTO = z.object({
  filter: viewFilterGroup,
  isOpenapi: z.boolean().optional(),
})

export type IBulkDeleteRecordsDTO = z.infer<typeof bulkDeleteRecordsDTO>
