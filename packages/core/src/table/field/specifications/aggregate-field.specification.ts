import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { IAbstractAggregateField, IAggregateFieldType } from '../field.type.js'
import { FieldId } from '../value-objects/field-id.vo.js'

export class WithAggregateFieldId extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(
    public readonly type: IAggregateFieldType,
    public readonly fieldId: string,
    public readonly aggregateFieldId: FieldId,
  ) {
    super()
  }

  static fromString(type: IAggregateFieldType, fieldId: string, aggregateFieldId: string) {
    return new this(type, fieldId, FieldId.fromString(aggregateFieldId))
  }

  isSatisfiedBy(t: Table): boolean {
    const field = t.schema.getFieldById(this.fieldId).unwrap() as IAbstractAggregateField
    return this.aggregateFieldId.equals(field.aggregateFieldId)
  }
  mutate(t: Table): Result<Table, string> {
    const field = t.schema.getFieldById(this.fieldId).unwrap() as IAbstractAggregateField
    field.aggregateFieldId = this.aggregateFieldId
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withAggregateFieldId(this)
    return Ok(undefined)
  }
}
