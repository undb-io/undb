import type { Option } from '@undb/domain'
import type { FieldValue } from '../../schema'
import type { FieldId } from '../../schema/fields/field-id.vo'
import type { RecordId } from './record-id.vo'
import type { RecordValuesVO } from './record-values.vo'

export class RecordDO {
  constructor(
    private readonly id: RecordId,
    private readonly values: RecordValuesVO
  ) {}

  public flatten() {
    return {
      id: this.id.value,
      ...this.values.toJSON(),
    }
  }

  getValue(fieldId: FieldId): Option<FieldValue> {
    return this.values.getValue(fieldId)
  }
}

export type IRecordDO = InstanceType<typeof RecordDO>
