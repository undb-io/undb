import { z } from "@undb/zod"
import { shareIdSchema } from "../share-id.vo"
import { shareTargetSchema } from "../share-target.vo"

export const shareDTO = z.object({
  id: shareIdSchema,
  target: shareTargetSchema.nullable(),
  enabled: z.boolean(),
})

export type IShareDTO = z.infer<typeof shareDTO>
