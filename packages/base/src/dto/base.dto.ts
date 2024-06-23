import { z } from "@undb/zod"
import { baseIdSchema, baseNameSchema } from "../value-objects"

export const baseDTO = z.object({
  id: baseIdSchema,
  name: baseNameSchema,
})

export type IBaseDTO = z.infer<typeof baseDTO>
