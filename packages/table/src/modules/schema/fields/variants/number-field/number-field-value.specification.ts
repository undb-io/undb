import { Ok,type Result } from '@undb/domain'
import type { IRecordVisitor,RecordDO } from '../../../../records'
import { RecordComositeSpecification } from '../../../../records/record/record.composite-specification'
import type { FieldId } from '../../field-id.vo'
import { NumberFieldValue } from './number-field-value.vo'

export class NumberEqual extends RecordComositeSpecification {
  constructor(
    readonly values: NumberFieldValue,
    readonly fieldId: FieldId
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => v instanceof NumberFieldValue && v.equals(this.values))
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.numberEqual(this)
    return Ok(undefined)
  }
}
