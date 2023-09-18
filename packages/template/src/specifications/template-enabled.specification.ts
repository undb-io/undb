import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import type { ITemplateVisitor } from '../interface.js'
import type { Template } from '../template.js'

export class WithTemplateEnabled extends CompositeSpecification<Template, ITemplateVisitor> {
  constructor(public readonly enabled: boolean) {
    super()
  }
  isSatisfiedBy(t: Template): boolean {
    return !!t.enabled === this.enabled
  }
  mutate(t: Template): Result<Template, string> {
    t.enabled = this.enabled
    return Ok(t)
  }
  accept(v: ITemplateVisitor): Result<void, string> {
    v.withEnabled(this)
    return Ok(undefined)
  }
}
