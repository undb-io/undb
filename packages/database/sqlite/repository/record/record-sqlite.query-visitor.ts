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
  NumberEqual,
  NumberGreaterThan,
  NumberGreaterThanOrEqual,
  NumberLessThan,
  NumberLessThanOrEqual,
  ReferenceEqual,
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
import { INTERNAL_COLUMN_CREATED_AT_NAME, INTERNAL_COLUMN_ID_NAME, INTERNAL_COLUMN_UPDATED_AT_NAME } from '@egodb/core'
import type { Knex } from '@mikro-orm/better-sqlite'
import { endOfDay, startOfDay } from 'date-fns'
import { INTERNAL_COLUMN_DELETED_AT_NAME } from '../../underlying-table/constants'

export class RecordSqliteQueryVisitor implements IRecordVisitor {
  public tableId!: string
  constructor(private qb: Knex.QueryBuilder) {
    this.qb = this.qb.whereNull(INTERNAL_COLUMN_DELETED_AT_NAME)
  }
  get query() {
    return this.qb.toQuery()
  }

  idEqual(s: WithRecordId): void {
    this.qb.where({ [INTERNAL_COLUMN_ID_NAME]: s.id.value })
  }
  tableIdEqual(s: WithRecordTableId): void {
    this.tableId = s.id.value
    this.qb.from(s.id.value)
  }
  createdAt(s: WithRecordCreatedAt): void {
    this.qb.where({ [INTERNAL_COLUMN_CREATED_AT_NAME]: s.date.value })
  }
  updatedAt(s: WithRecordUpdatedAt): void {
    this.qb.where({ [INTERNAL_COLUMN_UPDATED_AT_NAME]: s.date.value })
  }
  values(s: WithRecordValues): void {
    throw new Error('Method not implemented.')
  }
  stringEqual(s: StringEqual): void {
    this.qb.where({ [s.fieldId]: s.value.unpack() })
  }
  stringContain(s: StringContain): void {
    if (s.value.unpack() === null) {
      this.qb.whereNull(s.fieldId)
    } else {
      this.qb.whereRaw(`${s.fieldId} like '%??%'`, [s.value.unpack()])
    }
  }
  stringStartsWith(s: StringStartsWith): void {
    if (s.value.unpack() === null) {
      this.qb.whereNull(s.fieldId)
    } else {
      this.qb.whereRaw(`${s.fieldId} like '??%'`, [s.value.unpack()])
    }
  }
  stringEndsWith(s: StringEndsWith): void {
    if (s.value.unpack() === null) {
      this.qb.whereNull(s.fieldId)
    } else {
      this.qb.whereRaw(`${s.fieldId} like '%??'`, [s.value.unpack()])
    }
  }
  stringRegex(s: StringRegex): void {
    throw new Error('Method not implemented.')
  }
  numberEqual(s: NumberEqual): void {
    this.qb.where({ [s.fieldId]: s.value.unpack() })
  }
  numberGreaterThan(s: NumberGreaterThan): void {
    this.qb.where(s.fieldId, '>', s.value.unpack())
  }
  numberLessThan(s: NumberLessThan): void {
    this.qb.where(s.fieldId, '<', s.value.unpack())
  }
  numberGreaterThanOrEqual(s: NumberGreaterThanOrEqual): void {
    this.qb.where(s.fieldId, '>=', s.value.unpack())
  }
  numberLessThanOrEqual(s: NumberLessThanOrEqual): void {
    this.qb.where(s.fieldId, '<=', s.value.unpack())
  }
  dateEqual(s: DateEqual): void {
    this.qb.where({ [s.fieldId]: s.value.unpack() })
  }
  dateGreaterThan(s: DateGreaterThan): void {
    if (s.value.unpack() === null) {
      this.qb.whereNull(s.fieldId)
    } else {
      this.qb.where(s.fieldId, '>', s.value.unpack())
    }
  }
  dateLessThan(s: DateLessThan): void {
    if (s.value.unpack() === null) {
      this.qb.whereNull(s.fieldId)
    } else {
      this.qb.where(s.fieldId, '<', s.value.unpack())
    }
  }
  dateGreaterThanOrEqual(s: DateGreaterThanOrEqual): void {
    if (s.value.unpack() === null) {
      this.qb.whereNull(s.fieldId)
    } else {
      this.qb.where(s.fieldId, '>=', s.value.unpack())
    }
  }
  dateLessThanOrEqual(s: DateLessThanOrEqual): void {
    if (s.value.unpack() === null) {
      this.qb.whereNull(s.fieldId)
    } else {
      this.qb.where(s.fieldId, '<=', s.value.unpack())
    }
  }
  dateIsToday(s: DateIsToday): void {
    this.qb.whereBetween(s.fieldId, [startOfDay(new Date()), endOfDay(new Date())])
  }
  dateRangeEqual(s: DateRangeEqual): void {
    const range = s.value.unpack()
    if (range) {
      this.qb.whereBetween(s.fieldId, range)
    } else {
      this.qb.whereNull(s.fieldId)
    }
  }
  selectEqual(s: SelectEqual): void {
    this.qb.where(s.fieldId, s.value.unpack())
  }
  selectIn(s: SelectIn): void {
    this.qb.whereIn(
      s.fielId,
      s.value.map((v) => v.id),
    )
  }
  boolIsTrue(s: BoolIsTrue): void {
    this.qb.where(s.fieldId, true)
  }
  boolIsFalse(s: BoolIsFalse): void {
    this.qb.where(s.fieldId, false)
  }
  referenceEqual(s: ReferenceEqual): void {
    this.qb.where(s.fieldId, s.value.unpack() ? s.value.unpack() : JSON.stringify(s.value.unpack()))
  }

  not(): this {
    this.qb = this.qb.not
    return this
  }
}
