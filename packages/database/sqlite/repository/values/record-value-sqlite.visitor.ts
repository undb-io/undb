import type {
  BoolFieldValue,
  DateFieldValue,
  DateRangeFieldValue,
  IFieldValueVisitor,
  NumberFieldValue,
  ReferenceField,
  ReferenceFieldValue,
  SelectFieldValue,
  StringFieldValue,
  TableSchemaIdMap,
} from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { RecordValueData, RecordValueSqlitePrimitives } from '../../types/record-value-sqlite.type'
import { M2M_ID_FIELD, M2M_REF_ID_FIELD } from '../../underlying-table/constants'
import { UnderlyingM2MTable } from '../../underlying-table/underlying-table'

export class RecordValueSqliteVisitor implements IFieldValueVisitor {
  #data: RecordValueData = {}

  private setData(fieldId: string, value: RecordValueSqlitePrimitives): void {
    this.#data[fieldId] = value
  }

  public get data() {
    return this.#data
  }

  constructor(
    private readonly tableId: string,
    private readonly fieldId: string,
    private readonly recordId: string,
    private readonly schema: TableSchemaIdMap,
    private readonly em: EntityManager,
  ) {}

  public readonly queries: string[] = []

  private addQueries(...queries: string[]) {
    this.queries.push(...queries)
  }

  string(value: StringFieldValue): void {
    this.setData(this.fieldId, value.unpack())
  }
  number(value: NumberFieldValue): void {
    this.setData(this.fieldId, value.unpack())
  }
  bool(value: BoolFieldValue): void {
    this.setData(this.fieldId, value.unpack())
  }
  date(value: DateFieldValue): void {
    this.setData(this.fieldId, value.unpack())
  }
  dateRange(value: DateRangeFieldValue): void {
    this.setData(this.fieldId + '_from', value.from.into())
    this.setData(this.fieldId + '_to', value.to.into())
  }
  select(value: SelectFieldValue): void {
    this.setData(this.fieldId, value.unpack())
  }
  reference(value: ReferenceFieldValue): void {
    const unpacked = value.unpack()
    this.setData(this.fieldId, unpacked == null ? unpacked : JSON.stringify(unpacked))

    const field = this.schema.get(this.fieldId) as ReferenceField | undefined
    if (field) {
      const underlyingTable = new UnderlyingM2MTable(this.tableId, field)

      const query = this.em
        .getKnex()
        .queryBuilder()
        .table(underlyingTable.name)
        .delete()
        .where(M2M_REF_ID_FIELD, this.recordId)
        .toQuery()

      this.addQueries(query)

      const unpackedValue = value.unpack()
      if (unpackedValue?.length) {
        for (const recordId of unpackedValue) {
          const query = this.em
            .getKnex()
            .queryBuilder()
            .table(underlyingTable.name)
            .insert({ [M2M_ID_FIELD]: recordId, [M2M_REF_ID_FIELD]: this.recordId })
            .onConflict()
            .ignore()
            .toQuery()

          this.addQueries(query)
        }
      }
    }
  }
}
