import { CompositeSpecification, Ok, Result } from "@undb/domain"
import type { ITemplateSpecVisitor } from "../interface"
import type { TemplateDO } from "../template.do"
import type { TemplateId } from "../value-objects/template-id.vo"

export class WithTemplateId extends CompositeSpecification<TemplateDO, ITemplateSpecVisitor> {
  constructor(public readonly templateId: TemplateId) {
    super()
  }
  isSatisfiedBy(t: TemplateDO): boolean {
    return t.id.equals(this.templateId)
  }
  mutate(t: TemplateDO): Result<TemplateDO, string> {
    t.id = this.templateId
    return Ok(t)
  }
  accept(v: ITemplateSpecVisitor): Result<void, string> {
    v.withTemplateId(this)
    return Ok(undefined)
  }
}
