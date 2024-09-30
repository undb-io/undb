import { z } from "@undb/zod"
import { templateId } from "../template/value-objects/template-id.vo"

export const getTemplateDTO = z.object({
  id: templateId,
})

export type IGetTemplateDTO = z.infer<typeof getTemplateDTO>
