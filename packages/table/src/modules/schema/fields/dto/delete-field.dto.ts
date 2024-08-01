import { z } from "@undb/zod"
import { fieldId } from "../field-id.vo"

export const deleteFieldDTO = z.object({
  id: fieldId,
})

export type IDeleteFieldDTO = z.infer<typeof deleteFieldDTO>
