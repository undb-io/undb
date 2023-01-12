import type {
  BoolIsFalse,
  BoolIsTrue,
  DateEqual,
  DateGreaterThan,
  DateGreaterThanOrEqual,
  DateIsToday,
  DateLessThan,
  DateLessThanOrEqual,
  DateRangeEqual,
  IRecordVisitor,
  NullSpecification,
  NumberEqual,
  NumberGreaterThan,
  NumberGreaterThanOrEqual,
  NumberLessThan,
  NumberLessThanOrEqual,
  SelectEqual,
  SelectIn,
  StringContain,
  StringEndsWith,
  StringEqual,
  StringRegex,
  StringStartsWith,
  WithRecordCreatedAt,
  WithRecordId,
  WithRecordTableId,
  WithRecordUpdatedAt,
  WithRecordValues,
} from '@egodb/core'
import type { Knex } from '@mikro-orm/better-sqlite'
import { endOfDay, startOfDay } from 'date-fns'

export class RecordSqliteQueryVisitor implements IRecordVisitor {
  public tableId!: string
  constructor(private qb: Knex.QueryBuilder) {}

  idEqual(s: WithRecordId): void {
    this.qb.where({ id: s.id.value })
  }
  tableIdEqual(s: WithRecordTableId): void {
    this.tableId = s.id.value
    this.qb.from(s.id.value)
  }
  createdAt(s: WithRecordCreatedAt): void {
    this.qb.where({ created_at: s.date.value })
  }
  updatedAt(s: WithRecordUpdatedAt): void {
    this.qb.where({ updated_at: s.date.value })
  }
  values(s: WithRecordValues): void {
    throw new Error('Method not implemented.')
  }
  stringEqual(s: StringEqual): void {
    this.qb.where({ [s.fieldId]: s.value })
  }
  stringContain(s: StringContain): void {
    this.qb.whereRaw(`${s.fieldId} like '%??%'`, [s.value])
  }
  stringStartsWith(s: StringStartsWith): void {
    this.qb.whereRaw(`${s.fieldId} like '??%'`, [s.value])
  }
  stringEndsWith(s: StringEndsWith): void {
    this.qb.whereRaw(`${s.fieldId} like '%??'`, [s.value])
  }
  stringRegex(s: StringRegex): void {
    throw new Error('Method not implemented.')
  }
  numberEqual(s: NumberEqual): void {
    this.qb.where({ [s.fieldId]: s.value })
  }
  numberGreaterThan(s: NumberGreaterThan): void {
    this.qb.where(s.fieldId, '>', s.value)
  }
  numberLessThan(s: NumberLessThan): void {
    this.qb.where(s.fieldId, '<', s.value)
  }
  numberGreaterThanOrEqual(s: NumberGreaterThanOrEqual): void {
    this.qb.where(s.fieldId, '>=', s.value)
  }
  numberLessThanOrEqual(s: NumberLessThanOrEqual): void {
    this.qb.where(s.fieldId, '<=', s.value)
  }
  dateEqual(s: DateEqual): void {
    this.qb.where({ [s.fieldId]: s.value })
  }
  dateGreaterThan(s: DateGreaterThan): void {
    this.qb.where(s.fieldId, '>', s.value)
  }
  dateLessThan(s: DateLessThan): void {
    this.qb.where(s.fieldId, '<', s.value)
  }
  dateGreaterThanOrEqual(s: DateGreaterThanOrEqual): void {
    this.qb.where(s.fieldId, '>=', s.value)
  }
  dateLessThanOrEqual(s: DateLessThanOrEqual): void {
    this.qb.where(s.fieldId, '<=', s.value)
  }
  dateIsToday(s: DateIsToday): void {
    this.qb.whereBetween(s.fieldId, [startOfDay(new Date()), endOfDay(new Date())])
  }
  null(s: NullSpecification): void {
    this.qb.whereNull(s.fieldId)
  }
  dateRangeEqual(s: DateRangeEqual): void {
    if (s.value) {
      this.qb.whereBetween(s.fieldId, s.value)
    }
    this.qb.whereNull(s.fieldId)
  }
  selectEqual(s: SelectEqual): void {
    this.qb.where(s.fieldId, s.value)
  }
  selectIn(s: SelectIn): void {
    this.qb.whereIn(s.fielId, s.value)
  }
  boolIsTrue(s: BoolIsTrue): void {
    this.qb.where(s.fieldId, true)
  }
  boolIsFalse(s: BoolIsFalse): void {
    this.qb.where(s.fieldId, false)
  }
  not(): this {
    this.qb = this.qb.not
    return this
  }
}
