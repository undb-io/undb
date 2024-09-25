import { AggregateRoot } from "@undb/domain"
import type { TemplateId } from "./value-objects/template-id.vo"
import type { TemplateNameVO } from "./value-objects/template-name.vo"
import type { TemplateSchemaVariantsVO } from "./value-objects/template-schema-variants.vo"

export class TemplateDO extends AggregateRoot<any> {
  id!: TemplateId
  name!: TemplateNameVO
  template!: TemplateSchemaVariantsVO
}
