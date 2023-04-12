import { DateVO } from '@undb/domain'
import type { TableId, TableSchema, TableSchemaIdMap } from '../value-objects/index.js'
import { RecordFactory } from './record.factory.js'
import type { IInternalRecordValues, IMutateRecordValueSchema, RecordAllValues } from './record.schema.js'
import { createRecordInputs } from './record.utils.js'
import { WithRecordId, WithRecordTableId, WithRecordValues } from './specifications/index.js'
import type { RecordCompositeSpecification } from './specifications/interface.js'
import { RecordId, RecordValues } from './value-objects/index.js'
import { RecordDisplayValues } from './value-objects/record-display-values.vo.js'

export class Record {
  public id: RecordId = RecordId.create()
  public tableId!: TableId
  public values: RecordValues = RecordValues.empty()
  public displayValues?: RecordDisplayValues = RecordDisplayValues.empty()
  public createdAt: DateVO = DateVO.now()
  public createdBy!: string
  public updatedAt: DateVO = DateVO.now()
  public autoIncrement?: number

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static create() {
    const record = new Record()

    return record
  }

  get internalValuesJSON(): IInternalRecordValues {
    return {
      id: this.id.value,
      created_at: this.createdAt.value.toISOString(),
      created_by: this.createdBy,
      updated_at: this.updatedAt.value.toISOString(),
      auto_increment: this.autoIncrement,
      display_values: this.displayValues?.values,
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

  duplicate(schema: TableSchemaIdMap): Record {
    return RecordFactory.create(
      new WithRecordId(RecordId.create())
        .and(new WithRecordTableId(this.tableId))
        .and(new WithRecordValues(this.values.duplicate(schema))),
    ).unwrap()
  }
}
