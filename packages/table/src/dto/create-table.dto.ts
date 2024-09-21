import { baseIdSchema } from "@undb/base"
import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"
import { createSchemaDTO } from "../modules"
import { tableId } from "../table-id.vo"
import { tableName } from "../table-name.vo"

export const createTableDTO = z.object({
  id: tableId.optional(),
  name: tableName,
  baseId: baseIdSchema,
  spaceId: spaceIdSchema,

  schema: createSchemaDTO,
})

export type ICreateTableDTO = z.infer<typeof createTableDTO>
