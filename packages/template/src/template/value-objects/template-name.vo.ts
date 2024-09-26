import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"

export const templateName = z.string()

export type ITemplateName = z.infer<typeof templateName>

export class TemplateNameVO extends ValueObject<ITemplateName> {}
