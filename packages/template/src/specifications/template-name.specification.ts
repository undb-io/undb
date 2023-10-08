import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import { TemplateName } from '../value-objects/template-name.vo.js'
import type { ITemplateVisitor } from '../interface.js'
import type { Template } from '../template.js'

export class WithTemplateName extends CompositeSpecification<Template, ITemplateVisitor> {
  constructor(public readonly name: TemplateName) {
    super()
  }
  static fromString(name: string) {
    return new this(new TemplateName({ value: name }))
  }
  isSatisfiedBy(t: Template): boolean {
    return t.name.equals(this.name)
  }
  mutate(t: Template): Result<Template, string> {
    t.name = this.name
    return Ok(t)
  }
  accept(v: ITemplateVisitor): Result<void, string> {
    v.withName(this)
    return Ok(undefined)
  }
}
