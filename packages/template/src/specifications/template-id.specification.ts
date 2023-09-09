import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import type { TemplateID } from 'src/value-objects/template-id.vo.js'
import type { ITemplateVisitor } from '../interface.js'
import type { Template } from '../template.js'

export class WithTemplateId extends CompositeSpecification<Template, ITemplateVisitor> {
  constructor(public readonly id: TemplateID) {
    super()
  }
  isSatisfiedBy(t: Template): boolean {
    return t.id.equals(this.id)
  }
  mutate(t: Template): Result<Template, string> {
    t.id = this.id
    return Ok(t)
  }
  accept(v: ITemplateVisitor): Result<void, string> {
    v.withId(this)
    return Ok(undefined)
  }
}
