import { z } from "@undb/zod"
import { tableId } from "../../../table-id.vo"
import { recordId } from "../record"

export const getRecordByIdDTO = z.object({
  tableId: tableId,
  id: recordId,
})

export type IGetRecordByIdDTO = z.infer<typeof getRecordByIdDTO>
