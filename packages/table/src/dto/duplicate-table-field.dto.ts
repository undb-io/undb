import { z } from "@undb/zod"
import { duplicateFieldDTO } from "../modules"
import { tableId } from "../table-id.vo"

export const duplicateTableFieldDTO = duplicateFieldDTO.merge(
  z.object({
    tableId,
  }),
)

export type IDuplicateTableFieldDTO = z.infer<typeof duplicateTableFieldDTO>
