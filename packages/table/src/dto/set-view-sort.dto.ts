import { z } from "@undb/zod"
import { formDTO } from "../modules"
import { tableId } from "../table-id.vo"

export const setTableFormDTO = z.object({
  tableId: tableId,
  form: formDTO,
})

export type ISetTableFormDTO = z.infer<typeof setTableFormDTO>
