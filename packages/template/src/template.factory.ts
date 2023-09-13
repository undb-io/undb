import type { Table } from '@undb/core'
import { and } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import type { TemplateSpecification } from './interface.js'
import { WithTemplateExport } from './specifications/template-export.specification.js'
import { WithTemplateId } from './specifications/template-id.specification.js'
import { WithTemplateName } from './specifications/template-name.specification.js'
import { Template } from './template.js'
import type { ITemplateSchema } from './template.schema.js'
import { templateSchema } from './template.schema.js'
import { TemplateExport } from './value-objects/template-export.vo.js'

export class TemplateFactory {
  static create(...specs: TemplateSpecification[]) {
    return and(...specs)
      .unwrap()
      .mutate(Template.empty())
      .unwrap()
  }

  static fromJSON(json: ITemplateSchema) {
    const schema = templateSchema.parse(json)

    return this.create(
      WithTemplateId.fromString(schema.id),
      WithTemplateName.fromString(schema.name),
      WithTemplateExport.fromJSON(schema.export),
    )
  }

  static fromTables(tables: Table[]): Option<Template> {
    if (!tables.length) return None

    return Some(
      this.create(
        WithTemplateId.create(),
        WithTemplateName.fromString(tables.at(0)!.name.value),
        new WithTemplateExport(TemplateExport.fromTables(tables)),
      ),
    )
  }
}
