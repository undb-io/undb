import { z } from "@undb/zod"
import { deleteFieldDTO } from "../modules"
import { tableId } from "../table-id.vo"

export const deleteTableFieldDTO = deleteFieldDTO.merge(
  z.object({
    tableId,
  }),
)

export type IDeleteTableFieldDTO = z.infer<typeof deleteTableFieldDTO>
