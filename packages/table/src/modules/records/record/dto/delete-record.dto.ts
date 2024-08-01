import { z } from "@undb/zod"
import { recordId } from "../record-id.vo"

export const deleteRecordDTO = z.object({
  id: recordId,
})

export type IDeleteRecordDTO = z.infer<typeof deleteRecordDTO>
