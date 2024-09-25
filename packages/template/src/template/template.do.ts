import { AggregateRoot } from "@undb/domain"
import type { TemplateCategory } from "./value-objects/template-category.vo"
import type { TemplateId } from "./value-objects/template-id.vo"
import type { TemplateNameVO } from "./value-objects/template-name.vo"
import type { TemplateSchemaVariantsVO } from "./value-objects/template-schema-variants.vo"

export class TemplateDO extends AggregateRoot<any> {
  id!: TemplateId
  name!: TemplateNameVO
  category!: TemplateCategory
  template!: TemplateSchemaVariantsVO
}
