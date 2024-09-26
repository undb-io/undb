import { IdFactory } from "@undb/domain"
import { z } from "@undb/zod"

const prefix = "tpl"
const size = 8

export const templateId = z.string().startsWith(prefix).or(z.string())

export const TemplateIdVo = IdFactory(prefix, size, templateId)

export type TemplateId = InstanceType<typeof TemplateIdVo>
