import { baseIdSchema } from "@undb/base"
import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"
import { tableId } from "../table-id.vo"

export const duplicateTableDTO = z.object({
  tableId,
  baseId: baseIdSchema.optional(),
  spaceId: spaceIdSchema.optional(),
})

export type IDuplicateTableDTO = z.infer<typeof duplicateTableDTO>
