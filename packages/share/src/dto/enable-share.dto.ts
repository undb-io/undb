import { z } from "@undb/zod"
import { shareTargetSchema } from "../share-target.vo"

export const enableShareDTO = z.object({
  target: shareTargetSchema,
})

export type IEnableShareDTO = z.infer<typeof enableShareDTO>
