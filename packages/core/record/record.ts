import { DateVO } from '@egodb/domain'
import type { TableId, TableSchema } from '../value-objects'
import type { IInternalRecordValues, IMutateRecordValueSchema, RecordAllValues } from './record.schema'
import { createRecordInputs } from './record.utils'
import { WithRecordValues } from './specifications'
import type { RecordCompositeSpecification } from './specifications/interface'
import { RecordId, RecordValues } from './value-objects'

export class Record {
  public id: RecordId = RecordId.create()
  public tableId!: TableId
  public values: RecordValues = RecordValues.empty()
  public createdAt: DateVO = DateVO.now()
  public updatedAt: DateVO = DateVO.now()

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static create() {
    const record = new Record()

    return record
  }

  get internalValuesJSON(): IInternalRecordValues {
    return {
      id: this.id.value,
      created_at: this.createdAt.value,
      updated_at: this.updatedAt.value,
    }
  }

  get valuesJSON(): RecordAllValues {
    return Object.assign({}, this.internalValuesJSON, this.values.valueJSON)
  }

  updateRecord(schema: TableSchema, value: IMutateRecordValueSchema): RecordCompositeSpecification {
    const inputs = createRecordInputs(schema, value)
    const spec = WithRecordValues.fromArray(inputs)

    spec.mutate(this)

    return spec
  }
}
