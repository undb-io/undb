import { z } from "@undb/zod"
import { updateFieldDTO } from "../modules/schema/fields/dto/update-field.dto"
import { tableId } from "../table-id.vo"

export const updateTableFieldDTO = z.object({
  tableId: tableId,
  field: updateFieldDTO,
})

export type IUpdateTableFieldDTO = z.infer<typeof updateTableFieldDTO>
