import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import { TemplateID } from '../value-objects/template-id.vo.js'
import type { ITemplateVisitor } from '../interface.js'
import type { Template } from '../template.js'

export class WithTemplateId extends CompositeSpecification<Template, ITemplateVisitor> {
  constructor(public readonly id: TemplateID) {
    super()
  }
  static create() {
    return new this(TemplateID.create())
  }
  static fromString(id: string) {
    return new this(TemplateID.from(id))
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
