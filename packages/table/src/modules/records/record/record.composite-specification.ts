import { CompositeSpecification } from '@undb/domain'
import type { FieldId } from '../../schema/fields/field-id.vo'
import type { IRecordVisitor } from './record-visitor.interface'
import type { RecordDO } from './record.do'

export abstract class RecordComositeSpecification extends CompositeSpecification<RecordDO, IRecordVisitor> {
  constructor(public readonly fieldId: FieldId) {
    super()
  }
}
