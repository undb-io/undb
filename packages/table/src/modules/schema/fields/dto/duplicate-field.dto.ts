import { z } from "@undb/zod"
import { fieldId } from "../field-id.vo"

export const duplicateFieldDTO = z.object({
  id: fieldId,
})

export type IDuplicateFieldDTO = z.infer<typeof duplicateFieldDTO>
