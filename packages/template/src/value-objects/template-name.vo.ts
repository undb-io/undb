import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const templateNameSchema = z.string().nonempty()

export type ITemplateNameSchema = z.infer<typeof templateNameSchema>

export class TemplateName extends ValueObject<ITemplateNameSchema> {}
