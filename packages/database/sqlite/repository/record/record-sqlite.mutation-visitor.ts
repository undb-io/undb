import type {
  BoolIsFalse,
  BoolIsTrue,
  DateEqual,
  DateGreaterThan,
  DateGreaterThanOrEqual,
  DateIsToday,
  DateLessThan,
  DateLessThanOrEqual,
  IRecordVisitor,
  NullSpecification,
  NumberEqual,
  NumberGreaterThan,
  NumberGreaterThanOrEqual,
  NumberLessThan,
  NumberLessThanOrEqual,
  ReferenceField,
  SelectEqual,
  SelectIn,
  StringContain,
  StringEndsWith,
  StringEqual,
  StringRegex,
  StringStartsWith,
  TableSchemaIdMap,
  WithRecordCreatedAt,
  WithRecordId,
  WithRecordTableId,
  WithRecordUpdatedAt,
  WithRecordValues,
} from '@egodb/core'
import { DateRangeEqual, DateRangeFieldValue, ReferenceEqual, ReferenceFieldValue } from '@egodb/core'
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import { M2M_ID_FIELD, M2M_REF_ID_FIELD } from '../../underlying-table/constants'
import { UnderlyingM2MTable } from '../../underlying-table/underlying-table'

export class RecordSqliteMutationVisitor implements IRecordVisitor {
  constructor(
    private readonly tableId: string,
    private readonly recordId: string,
    private readonly schema: TableSchemaIdMap,
    private readonly em: EntityManager,
    private readonly qb: Knex.QueryBuilder,
  ) {}

  private queries: string[] = []

  private addQueries(...queries: string[]) {
    this.queries.push(...queries)
  }

  public async commit(): Promise<void> {
    await this.em.execute(this.qb)
    for (const query of this.queries) {
      await this.em.execute(query)
    }
  }

  private get knex() {
    return this.em.getKnex()
  }

  null(s: NullSpecification): void {
    throw new Error('Method not implemented.')
  }
  idEqual(s: WithRecordId): void {
    throw new Error('Method not implemented.')
  }
  tableIdEqual(s: WithRecordTableId): void {
    throw new Error('Method not implemented.')
  }
  createdAt(s: WithRecordCreatedAt): void {
    throw new Error('Method not implemented.')
  }
  updatedAt(s: WithRecordUpdatedAt): void {
    throw new Error('Method not implemented.')
  }
  values(s: WithRecordValues): void {
    const values = [...s.values.value.entries()]
    // TODO
    for (const [fieldId, value] of values) {
      if (value instanceof DateRangeFieldValue) {
        this.dateRangeEqual(new DateRangeEqual(fieldId, value.unpack()))
      } else if (value instanceof ReferenceFieldValue) {
        this.referenceEqual(new ReferenceEqual(fieldId, value.unpack()))
      } else {
        this.qb.update(fieldId, value.unpack())
      }
    }
  }
  stringEqual(s: StringEqual): void {
    throw new Error('Method not implemented.')
  }
  stringContain(s: StringContain): void {
    throw new Error('Method not implemented.')
  }
  stringStartsWith(s: StringStartsWith): void {
    throw new Error('Method not implemented.')
  }
  stringEndsWith(s: StringEndsWith): void {
    throw new Error('Method not implemented.')
  }
  stringRegex(s: StringRegex): void {
    throw new Error('Method not implemented.')
  }
  numberEqual(s: NumberEqual): void {
    throw new Error('Method not implemented.')
  }
  numberGreaterThan(s: NumberGreaterThan): void {
    throw new Error('Method not implemented.')
  }
  numberLessThan(s: NumberLessThan): void {
    throw new Error('Method not implemented.')
  }
  numberGreaterThanOrEqual(s: NumberGreaterThanOrEqual): void {
    throw new Error('Method not implemented.')
  }
  numberLessThanOrEqual(s: NumberLessThanOrEqual): void {
    throw new Error('Method not implemented.')
  }
  dateEqual(s: DateEqual): void {
    throw new Error('Method not implemented.')
  }
  dateGreaterThan(s: DateGreaterThan): void {
    throw new Error('Method not implemented.')
  }
  dateLessThan(s: DateLessThan): void {
    throw new Error('Method not implemented.')
  }
  dateGreaterThanOrEqual(s: DateGreaterThanOrEqual): void {
    throw new Error('Method not implemented.')
  }
  dateLessThanOrEqual(s: DateLessThanOrEqual): void {
    throw new Error('Method not implemented.')
  }
  dateIsToday(s: DateIsToday): void {
    throw new Error('Method not implemented.')
  }
  dateRangeEqual(s: DateRangeEqual): void {
    this.qb.update({
      [s.fieldId + '_from']: s.value?.[0],
      [s.fieldId + '_to']: s.value?.[1],
    })
  }
  selectEqual(s: SelectEqual): void {
    throw new Error('Method not implemented.')
  }
  selectIn(s: SelectIn): void {
    throw new Error('Method not implemented.')
  }
  boolIsTrue(s: BoolIsTrue): void {
    throw new Error('Method not implemented.')
  }
  boolIsFalse(s: BoolIsFalse): void {
    throw new Error('Method not implemented.')
  }
  referenceEqual(s: ReferenceEqual): void {
    const value = s.value
    this.qb.update(s.fieldId, value == null ? value : JSON.stringify(value))

    const field = this.schema.get(s.fieldId) as ReferenceField | undefined
    if (field && s.value) {
      const underlyingTable = new UnderlyingM2MTable(this.tableId, field)

      const query = this.em
        .getKnex()
        .queryBuilder()
        .table(underlyingTable.name)
        .delete()
        .where(M2M_REF_ID_FIELD, this.recordId)
        .toQuery()

      this.addQueries(query)

      for (const recordId of s.value) {
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
  not(): this {
    throw new Error('Method not implemented.')
  }
}
