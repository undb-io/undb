import { z } from "@undb/zod"
import { tableId } from "../../../table-id.vo"
import { formId } from "../form/form-id.vo"

export const deleteFormDTO = z.object({
  id: formId,
})
export type IDeleteFormDTO = z.infer<typeof deleteFormDTO>

export const deleteTableFormDTO = deleteFormDTO.merge(z.object({ tableId }))
export type IDeleteTableFormDTO = z.infer<typeof deleteTableFormDTO>
