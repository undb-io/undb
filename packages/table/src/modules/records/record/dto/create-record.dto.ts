import { z } from "@undb/zod"
import { recordId } from "../record-id.vo"
import { recordValues } from "../record-values.vo"

export const createRecordDTO = z.object({
  id: recordId.optional(),
  values: recordValues,
})

export type ICreateRecordDTO = z.infer<typeof createRecordDTO>
