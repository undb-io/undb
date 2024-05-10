import type { Option } from '@undb/domain'
import type { TableDo } from '../../../table.do'
import type { FieldValue } from '../../schema'
import type { FieldId } from '../../schema/fields/field-id.vo'
import type { ICreateRecordDTO } from './dto'
import { RecordIdVO, type RecordId } from './record-id.vo'
import { RecordValuesVO } from './record-values.vo'

export class RecordDO {
  constructor(
    private readonly id: RecordId,
    private readonly values: RecordValuesVO
  ) {}

  static create(table: TableDo, dto: ICreateRecordDTO) {
    return new RecordDO(RecordIdVO.create(dto.id), RecordValuesVO.create(table, dto.values))
  }

  public flatten() {
    return {
      id: this.id.value,
      ...this.values.toJSON(),
    }
  }

  public insertValues() {
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
