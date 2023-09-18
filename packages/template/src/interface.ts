import type { CompositeSpecification, ISpecVisitor } from '@undb/domain'
import type { WithTemplateEnabled } from './specifications/template-enabled.specification.js'
import type { WithTemplateExport } from './specifications/template-export.specification.js'
import type { WithTemplateId } from './specifications/template-id.specification.js'
import type { WithTemplateName } from './specifications/template-name.specification.js'
import type { Template } from './template.js'

export interface ITemplateVisitor extends ISpecVisitor {
  withId(s: WithTemplateId): void
  withName(s: WithTemplateName): void
  withEnabled(s: WithTemplateEnabled): void
  withExports(s: WithTemplateExport): void
}

export type TemplateSpecification = CompositeSpecification<Template, ITemplateVisitor>
