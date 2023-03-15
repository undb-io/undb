import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications'
import type { Table } from '../../table'
import type { BaseField } from '../field.base'

export class WithFieldRequirement extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly field: BaseField, public readonly required: boolean) {
    super()
  }
  isSatisfiedBy(t: Table): boolean {
    return this.field.required === this.required
  }
  mutate(t: Table): Result<Table, string> {
    this.field.required = this.required
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withFieldRequirement(this)
    return Ok(undefined)
  }
}
