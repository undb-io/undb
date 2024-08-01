import { z } from "@undb/zod"
import { formId } from "../form/form-id.vo"
import { formName } from "../form/form-name.vo"
import { tableId } from "../../../table-id.vo"

export const createFormDTO = z.object({
  id: formId.optional(),
  name: formName,
  // TODO: should create table accept fields?
  // now it's not used
  // just using table fields
  // fields: formField.optional(),
})
export type ICreateFormDTO = z.infer<typeof createFormDTO>

export const createTableFormDTO = createFormDTO.merge(z.object({ tableId }))
export type ICreateTableFormDTO = z.infer<typeof createTableFormDTO>
