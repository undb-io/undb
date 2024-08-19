import { z } from "@undb/zod"
import { baseIdSchema } from "../value-objects"

export const deleteBaseDTO = z.object({
  id: baseIdSchema,
})

export type IDeleteBaseDTO = z.infer<typeof deleteBaseDTO>
