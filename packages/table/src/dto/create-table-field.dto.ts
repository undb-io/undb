import { z } from "@undb/zod"
import { createFieldDTO } from "../modules/schema/fields/dto/create-field.dto"
import { tableId } from "../table-id.vo"

export const createTableFieldDTO = z.object({
  tableId: tableId,
  field: createFieldDTO,
})

export type ICreateTableFieldDTO = z.infer<typeof createTableFieldDTO>
