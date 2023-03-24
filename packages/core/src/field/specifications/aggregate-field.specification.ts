import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { IAbstractAggregateField } from '../field.type.js'
import { FieldId } from '../value-objects/index.js'

export class WithAggregateFieldId extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(private readonly field: IAbstractAggregateField, private readonly aggregateFieldId: FieldId) {
    super()
  }

  static fromString(field: IAbstractAggregateField, fieldId: string) {
    return new this(field, FieldId.fromString(fieldId))
  }

  isSatisfiedBy(t: Table): boolean {
    return this.aggregateFieldId.equals(this.field.aggregateFieldId)
  }
  mutate(t: Table): Result<Table, string> {
    this.field.aggregateFieldId = this.aggregateFieldId
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    return Ok(undefined)
  }
}
