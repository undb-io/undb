import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { IAbstractLookupField, ILookupFieldType } from '../field.type.js'
import { FieldId } from '../value-objects/index.js'

export class WithReferenceFieldId extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(
    public readonly type: ILookupFieldType,
    public readonly fieldId: string,
    public readonly referenceFieldId: FieldId,
  ) {
    super()
  }

  static fromString(type: ILookupFieldType, fieldId: string, referenceFieldId: string) {
    return new this(type, fieldId, FieldId.fromString(referenceFieldId))
  }

  isSatisfiedBy(t: Table): boolean {
    const field = t.schema.getFieldById(this.fieldId).unwrap() as IAbstractLookupField
    return this.referenceFieldId.equals(field.referenceFieldId)
  }
  mutate(t: Table): Result<Table, string> {
    const field = t.schema.getFieldById(this.fieldId).unwrap() as IAbstractLookupField
    field.referenceFieldId = this.referenceFieldId
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withReferenceFieldId(this)
    return Ok(undefined)
  }
}
