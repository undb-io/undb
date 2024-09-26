import type { CompositeSpecification, ISpecVisitor } from "@undb/domain"
import type { WithTemplateId } from "./specifications/template-id.specification"
import type { TemplateDO } from "./template.do"

export interface ITemplateSpecVisitor extends ISpecVisitor {
  withTemplateId(v: WithTemplateId): void
}

export type ITemplateSpecification = CompositeSpecification<TemplateDO, ITemplateSpecVisitor>
