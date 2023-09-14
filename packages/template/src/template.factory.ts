import type { Table } from '@undb/core'
import { and } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import type { TemplateSpecification } from './interface.js'
import { WithTemplateExport } from './specifications/template-export.specification.js'
import { WithTemplateId } from './specifications/template-id.specification.js'
import { WithTemplateName } from './specifications/template-name.specification.js'
import { TemplateIdVisitor } from './template-id.visitor.js'
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
    let template = templateSchema.parse(json)
    template = new TemplateIdVisitor().visit(template)

    return this.create(
      WithTemplateId.fromString(template.id),
      WithTemplateName.fromString(template.name),
      WithTemplateExport.fromJSON(template.export),
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
