import { DateVO } from '@undb/domain'
import type { JsonObject } from 'type-fest'
import type { ICollaboratorProfile } from '../field/index.js'
import type { Table } from '../table.js'
import type { TableId, TableSchema, TableSchemaIdMap } from '../value-objects/index.js'
import type { IQueryRecordSchema, IRecordDisplayValues } from './index.js'
import { RecordFactory } from './record.factory.js'
import type {
  IInternalRecordValues,
  IMutateRecordValueSchema,
  RecordAllJSON,
  RecordAllValues,
} from './record.schema.js'
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
  public createdByProfile: ICollaboratorProfile | null = null
  public updatedBy!: string
  public updatedByProfile: ICollaboratorProfile | null = null
  public updatedAt: DateVO = DateVO.now()
  public autoIncrement?: number

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static empty() {
    const record = new Record()

    return record
  }

  get internalValuesJSON(): IInternalRecordValues {
    return {
      id: this.id.value,
      created_at: this.createdAt.value.toISOString(),
      created_by: this.createdBy,
      created_by_profile: this.createdByProfile,
      updated_at: this.updatedAt.value.toISOString(),
      updated_by: this.updatedBy,
      updated_by_profile: this.updatedByProfile,
      auto_increment: this.autoIncrement,
      display_values: this.displayValues?.values,
    }
  }

  get valuesPair(): RecordAllValues {
    return Object.assign({}, this.internalValuesJSON, this.values.valuesPair)
  }

  get valuesJSON(): RecordAllJSON {
    return Object.assign({}, this.internalValuesJSON, this.values.valuesJSON)
  }

  public toHuman(table: Table, viewId: string, displayValues?: IRecordDisplayValues): JsonObject {
    const data: JsonObject = {}

    const valueJSON = this.valuesJSON

    const view = table.mustGetView(viewId)
    for (const field of table.getOrderedFields(view, false)) {
      data[field.name.value] = field.getDisplayValue(valueJSON, displayValues)
    }

    return data
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

  toQuery(tableId: string): IQueryRecordSchema {
    return {
      id: this.id.value,
      createdAt: this.createdAt.value.toISOString(),
      updatedAt: this.updatedAt.value.toISOString(),
      createdBy: this.createdBy,
      createdByProfile: this.createdByProfile,
      updatedBy: this.updatedBy,
      updatedByProfile: this.updatedByProfile,
      autoIncrement: this.autoIncrement,
      tableId,
      values: this.values.valuesJSON,
      displayValues: this.displayValues?.values ?? {},
    }
  }

  public getDisplayFieldsValue(table: Table): string {
    const displayFields = table.schema.displayFields
    const values = this.valuesJSON

    return displayFields
      .map((field) => values[field.id.value])
      .filter(Boolean)
      .join(' ')
  }
}
