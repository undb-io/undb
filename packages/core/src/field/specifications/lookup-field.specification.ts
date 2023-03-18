import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { BaseLookupField } from '../field.base.js'
import type { ICountField, ILookupField } from '../field.type.js'
import { FieldId } from '../value-objects/index.js'

export class WithReferenceFieldId extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(
    private readonly field: BaseLookupField<ILookupField | ICountField>,
    private readonly referenceFieldId: FieldId,
  ) {
    super()
  }

  static fromString(field: BaseLookupField<ILookupField | ICountField>, fieldId: string) {
    return new this(field, FieldId.fromString(fieldId))
  }

  isSatisfiedBy(t: Table): boolean {
    return this.referenceFieldId.equals(this.field.referenceFieldId)
  }
  mutate(t: Table): Result<Table, string> {
    this.field.referenceFieldId = this.referenceFieldId
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    throw new Error('Method not implemented.')
  }
}
