import { z } from "@undb/zod"
import { baseIdSchema, baseNameSchema } from "../value-objects"

export const createBaseDTO = z.object({
  id: baseIdSchema.optional(),
  name: baseNameSchema,
})

export type ICreateBaseDTO = z.infer<typeof createBaseDTO>
