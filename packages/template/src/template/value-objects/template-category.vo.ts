import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"

export const templateCategory = z.enum([
  "hr",
  "crm",
  "marketing",
  "sales",
  "it",
  "finance",
  "legal",
  "product",
  "design",
  "customer-support",
  "other",
  "startup",
  "project",
  "personal",
  "development",
  "agile",
])

export type ITemplateCategory = z.infer<typeof templateCategory>

export class TemplateCategory extends ValueObject<ITemplateCategory> {}
