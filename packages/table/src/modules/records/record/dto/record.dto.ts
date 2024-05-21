import { z } from "@undb/zod"
import { recordId } from "../record-id.vo"
import { recordValues } from "../record-values.vo"

export const recordDTO = z.object({
  id: recordId,
  values: recordValues,
})

export type IRecordDTO = z.infer<typeof recordDTO>
