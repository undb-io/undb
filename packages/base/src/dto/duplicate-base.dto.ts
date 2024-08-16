import { z } from "@undb/zod"
import { baseIdSchema } from "../value-objects"

export const duplicateBaseDTO = z.object({
  id: baseIdSchema,
})

export type IDuplicateBaseDTO = z.infer<typeof duplicateBaseDTO>
