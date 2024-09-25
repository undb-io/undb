import { z } from "@undb/zod"
import { templateId } from "../template/value-objects/template-id.vo"
import { templateName } from "../template/value-objects/template-name.vo"
import { templateSchemaVariants } from "../template/value-objects/template-schema-variants.vo"

export const templateDTO = z.object({
  id: templateId,
  name: templateName,
  template: templateSchemaVariants,
})

export type ITemplateDTO = z.infer<typeof templateDTO>
