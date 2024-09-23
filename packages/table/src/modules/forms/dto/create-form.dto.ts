import { z } from "@undb/zod"
import { tableId } from "../../../table-id.vo"
import { createFormField } from "../form"
import { formId } from "../form/form-id.vo"
import { formName } from "../form/form-name.vo"

export const createFormDTO = z.object({
  id: formId.optional(),
  name: formName,
  fields: createFormField.array().optional(),
})

export const createFormWithoutNameDTO = createFormDTO.omit({ name: true })

export type ICreateFormDTO = z.infer<typeof createFormDTO>

export const createTableFormDTO = createFormDTO.merge(z.object({ tableId }))
export type ICreateTableFormDTO = z.infer<typeof createTableFormDTO>
