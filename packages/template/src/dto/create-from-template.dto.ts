import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"
import { templateId } from "../template/value-objects/template-id.vo"

export const createFromTemplateDTO = z.object({
  id: templateId,
  spaceId: spaceIdSchema.optional(),
  includeData: z.boolean().optional(),
})

export type ICreateFromTemplateDTO = z.infer<typeof createFromTemplateDTO>
