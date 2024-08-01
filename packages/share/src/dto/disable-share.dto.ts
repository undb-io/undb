import { z } from "@undb/zod"
import { shareTargetSchema } from "../share-target.vo"

export const disableShareDTO = z.object({
  target: shareTargetSchema,
})

export type IDisableShareDTO = z.infer<typeof disableShareDTO>
