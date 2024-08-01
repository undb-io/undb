import { z } from "@undb/zod"
import { recordId } from "../record-id.vo"
import { recordValues } from "../record-values.vo"

export const updateRecordDTO = z.object({
  id: recordId,
  values: recordValues,
})

export type IUpdateRecordDTO = z.infer<typeof updateRecordDTO>
