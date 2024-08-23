import { z } from "@undb/zod"
import { baseIdSchema, baseNameSchema } from "../value-objects"

export const updateBaseDTO = z.object({
  id: baseIdSchema,
  name: baseNameSchema.optional(),
})

export type IUpdateBaseDTO = z.infer<typeof updateBaseDTO>
