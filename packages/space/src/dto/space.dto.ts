import { z } from "@undb/zod"
import { spaceIdSchema, spaceNameSchema } from "../value-objects"

export const spaceDTO = z.object({
  id: spaceIdSchema,
  name: spaceNameSchema,
  isPersonal: z.boolean(),
})

export type ISpaceDTO = z.infer<typeof spaceDTO>
