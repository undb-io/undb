import { z } from "@undb/zod"
import { viewFilterGroup } from "../../../views"
import { recordValues } from "../record-values.vo"

export const bulkUpdateRecordsDTO = z.object({
  filter: viewFilterGroup.optional(),
  values: recordValues,
  isOpenapi: z.boolean().optional(),
})

export type IBulkUpdateRecordsDTO = z.infer<typeof bulkUpdateRecordsDTO>
