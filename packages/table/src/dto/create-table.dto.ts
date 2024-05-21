import { z } from "@undb/zod"
import { createSchemaDTO } from "../modules"
import { tableId } from "../table-id.vo"
import { tableName } from "../table-name.vo"

export const createTableDTO = z.object({
  id: tableId.optional(),
  name: tableName,
  schema: createSchemaDTO,
})

export type ICreateTableDTO = z.infer<typeof createTableDTO>
