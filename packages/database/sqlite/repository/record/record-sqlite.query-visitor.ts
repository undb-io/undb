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
import { INTERNAL_FIELD_CREATED_AT_NAME, INTERNAL_FIELD_ID_NAME, INTERNAL_FIELD_UPDATED_AT_NAME } from '@egodb/core'
import type { Knex } from '@mikro-orm/better-sqlite'
import { endOfDay, startOfDay } from 'date-fns'

export class RecordSqliteQueryVisitor implements IRecordVisitor {
  public tableId!: string
  constructor(private qb: Knex.QueryBuilder) {}

  get query() {
    return this.qb.toQuery()
  }

  idEqual(s: WithRecordId): void {
    this.qb.where({ [INTERNAL_FIELD_ID_NAME]: s.id.value })
  }
  tableIdEqual(s: WithRecordTableId): void {
    this.tableId = s.id.value
    this.qb.from(s.id.value)
  }
  createdAt(s: WithRecordCreatedAt): void {
    this.qb.where({ [INTERNAL_FIELD_CREATED_AT_NAME]: s.date.value })
  }
  updatedAt(s: WithRecordUpdatedAt): void {
    this.qb.where({ [INTERNAL_FIELD_UPDATED_AT_NAME]: s.date.value })
  }
  values(s: WithRecordValues): void {
    throw new Error('Method not implemented.')
  }
  stringEqual(s: StringEqual): void {
    this.qb.where({ [s.fieldKey]: s.value })
  }
  stringContain(s: StringContain): void {
    if (s.value === null) {
      this.qb.whereNull(s.fieldKey)
    } else {
      this.qb.whereRaw(`${s.fieldKey} like '%??%'`, [s.value])
    }
  }
  stringStartsWith(s: StringStartsWith): void {
    if (s.value === null) {
      this.qb.whereNull(s.fieldKey)
    } else {
      this.qb.whereRaw(`${s.fieldKey} like '??%'`, [s.value])
    }
  }
  stringEndsWith(s: StringEndsWith): void {
    if (s.value === null) {
      this.qb.whereNull(s.fieldKey)
    } else {
      this.qb.whereRaw(`${s.fieldKey} like '%??'`, [s.value])
    }
  }
  stringRegex(s: StringRegex): void {
    throw new Error('Method not implemented.')
  }
  numberEqual(s: NumberEqual): void {
    this.qb.where({ [s.fieldKey]: s.value })
  }
  numberGreaterThan(s: NumberGreaterThan): void {
    this.qb.where(s.fieldKey, '>', s.value)
  }
  numberLessThan(s: NumberLessThan): void {
    this.qb.where(s.fieldKey, '<', s.value)
  }
  numberGreaterThanOrEqual(s: NumberGreaterThanOrEqual): void {
    this.qb.where(s.fieldKey, '>=', s.value)
  }
  numberLessThanOrEqual(s: NumberLessThanOrEqual): void {
    this.qb.where(s.fieldKey, '<=', s.value)
  }
  dateEqual(s: DateEqual): void {
    this.qb.where({ [s.fieldKey]: s.value })
  }
  dateGreaterThan(s: DateGreaterThan): void {
    if (s.value === null) {
      this.qb.whereNull(s.fieldKey)
    } else {
      this.qb.where(s.fieldKey, '>', s.value)
    }
  }
  dateLessThan(s: DateLessThan): void {
    if (s.value === null) {
      this.qb.whereNull(s.fieldKey)
    } else {
      this.qb.where(s.fieldKey, '<', s.value)
    }
  }
  dateGreaterThanOrEqual(s: DateGreaterThanOrEqual): void {
    if (s.value === null) {
      this.qb.whereNull(s.fieldKey)
    } else {
      this.qb.where(s.fieldKey, '>=', s.value)
    }
  }
  dateLessThanOrEqual(s: DateLessThanOrEqual): void {
    if (s.value === null) {
      this.qb.whereNull(s.fieldKey)
    } else {
      this.qb.where(s.fieldKey, '<=', s.value)
    }
  }
  dateIsToday(s: DateIsToday): void {
    this.qb.whereBetween(s.fieldKey, [startOfDay(new Date()), endOfDay(new Date())])
  }
  null(s: NullSpecification): void {
    this.qb.whereNull(s.fieldKey)
  }
  dateRangeEqual(s: DateRangeEqual): void {
    if (s.value) {
      this.qb.whereBetween(s.fieldKey, s.value)
    } else {
      this.qb.whereNull(s.fieldKey)
    }
  }
  selectEqual(s: SelectEqual): void {
    this.qb.where(s.fieldKey, s.value)
  }
  selectIn(s: SelectIn): void {
    this.qb.whereIn(s.fielId, s.value)
  }
  boolIsTrue(s: BoolIsTrue): void {
    this.qb.where(s.fieldKey, true)
  }
  boolIsFalse(s: BoolIsFalse): void {
    this.qb.where(s.fieldKey, false)
  }
  not(): this {
    this.qb = this.qb.not
    return this
  }
}
