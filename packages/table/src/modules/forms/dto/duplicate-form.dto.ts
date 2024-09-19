import { z } from "@undb/zod"
import { tableId } from "../../../table-id.vo"
import { formName } from "../form"
import { formId } from "../form/form-id.vo"

export const duplicateFormDTO = z.object({
  id: formId,
  name: formName.optional(),
})
export type IDuplicateFormDTO = z.infer<typeof duplicateFormDTO>

export const duplicateTableFormDTO = duplicateFormDTO.merge(z.object({ tableId }))
export type IDuplicateTableFormDTO = z.infer<typeof duplicateTableFormDTO>
