import { CompositeSpecification } from '@egodb/domain'
import { isEqual } from 'lodash-es'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { BaseReferenceField } from '../field.base.js'
import type { ILookupField, IParentField, IReferenceField, ITreeField } from '../field.type.js'
import type { LookupField } from '../lookup-field.js'
import { FieldId } from '../value-objects/field-id.vo.js'

export class WithDisplayFields extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(
    public readonly field: BaseReferenceField<ITreeField | IParentField | IReferenceField> | LookupField,
    public readonly displayFields: FieldId[],
  ) {
    super()
  }
  static fromIds(
    field: BaseReferenceField<ITreeField | IParentField | IReferenceField | ILookupField> | LookupField,
    ids: string[],
  ) {
    return new this(
      field,
      ids.map((id) => FieldId.fromString(id)),
    )
  }
  isSatisfiedBy(t: Table): boolean {
    return isEqual(this.field.displayFieldIds, this)
  }
  mutate(t: Table): Result<Table, string> {
    this.field.displayFieldIds = this.displayFields
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.displayFieldsEqual(this)
    return Ok(undefined)
  }
}
