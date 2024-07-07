import { z } from "@undb/zod"
import { tableId } from "../../../table-id.vo"
import { fieldId } from "../../schema"
import { recordId } from "../record"

export const getRecordByIdDTO = z.object({
  tableId: tableId,
  id: recordId,
  select: fieldId.array().optional(),
})

export type IGetRecordByIdDTO = z.infer<typeof getRecordByIdDTO>
