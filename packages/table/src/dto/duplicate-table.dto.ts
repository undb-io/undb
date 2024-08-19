import { baseIdSchema } from "@undb/base"
import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"
import { tableId } from "../table-id.vo"
import { tableName } from "../table-name.vo"

export const duplicateTableDTO = z.object({
  tableId,
  name: tableName.optional(),
  baseId: baseIdSchema.optional(),
  spaceId: spaceIdSchema.optional(),
  includeData: z.boolean().optional(),
  isSameSpace: z.boolean().optional(),
})

export type IDuplicateTableDTO = z.infer<typeof duplicateTableDTO>
