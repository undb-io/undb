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
  IsRoot,
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
  TableSchemaIdMap,
  TreeAvailableSpec,
  WithRecordAutoIncrement,
  WithRecordCreatedAt,
  WithRecordId,
  WithRecordTableId,
  WithRecordUpdatedAt,
  WithRecordValues,
} from '@egodb/core'
import {
  INTERNAL_COLUMN_CREATED_AT_NAME,
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_UPDATED_AT_NAME,
  INTERNAL_INCREAMENT_ID_NAME,
  TreeField,
} from '@egodb/core'
import type { Knex } from '@mikro-orm/better-sqlite'
import { endOfDay, startOfDay } from 'date-fns'
import { INTERNAL_COLUMN_DELETED_AT_NAME } from '../../underlying-table/constants'
import { UnderlyingClosureTable } from '../../underlying-table/underlying-foreign-table'

export class RecordSqliteQueryVisitor implements IRecordVisitor {
  constructor(
    private readonly tableId: string,
    private readonly schema: TableSchemaIdMap,
    private qb: Knex.QueryBuilder,
    private knex: Knex,
  ) {
    this.qb = qb.from(tableId).whereNull(INTERNAL_COLUMN_DELETED_AT_NAME)
  }
  get query() {
    return this.qb.toQuery()
  }

  idEqual(s: WithRecordId): void {
    this.qb.where({ [INTERNAL_COLUMN_ID_NAME]: s.id.value })
  }
  tableIdEqual(s: WithRecordTableId): void {
    this.qb.from(s.id.value)
  }
  createdAt(s: WithRecordCreatedAt): void {
    this.qb.where({ [INTERNAL_COLUMN_CREATED_AT_NAME]: s.date.value })
  }
  updatedAt(s: WithRecordUpdatedAt): void {
    this.qb.where({ [INTERNAL_COLUMN_UPDATED_AT_NAME]: s.date.value })
  }
  autoIncrement(s: WithRecordAutoIncrement): void {
    this.qb.where(INTERNAL_INCREAMENT_ID_NAME, s.n)
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
      this.qb.whereLike(s.fieldId, `%${s.value.unpack()}%`)
    }
  }
  stringStartsWith(s: StringStartsWith): void {
    if (s.value.unpack() === null) {
      this.qb.whereNull(s.fieldId)
    } else {
      this.qb.whereLike(s.fieldId, `${s.value.unpack()}%`)
    }
  }
  stringEndsWith(s: StringEndsWith): void {
    if (s.value.unpack() === null) {
      this.qb.whereNull(s.fieldId)
    } else {
      this.qb.whereLike(s.fieldId, `%${s.value.unpack()}`)
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

  treeAvailable(s: TreeAvailableSpec): void {
    const field = this.schema.get(s.fielId)
    if (!(field instanceof TreeField)) return

    const closureTable = new UnderlyingClosureTable(this.tableId, field)
    // 去掉已经有父级的 recordId
    const subQuery = this.knex
      .queryBuilder()
      .from(closureTable.name)
      .select(UnderlyingClosureTable.CLOSURE_TABLE_CHILD_ID_FIELD)
      .where(UnderlyingClosureTable.CLOSURE_TABLE_DEPTH_FIELD, '>', 0)
      .distinct()

    const recordId = s.value
    // 去掉自己父级或祖先的 recordId
    if (recordId) {
      subQuery.union(
        this.knex
          .queryBuilder()
          .from(closureTable.name)
          .select(UnderlyingClosureTable.CLOSURE_TABLE_PARENT_ID_FIELD)
          .where(UnderlyingClosureTable.CLOSURE_TABLE_CHILD_ID_FIELD, recordId)
          .andWhereNot(UnderlyingClosureTable.CLOSURE_TABLE_PARENT_ID_FIELD, recordId)
          .distinct(),
      )
    }

    this.qb.whereNotIn(INTERNAL_COLUMN_ID_NAME, subQuery)
    if (recordId) {
      this.qb.andWhereNot(INTERNAL_COLUMN_ID_NAME, recordId)
    }
  }

  isRoot(s: IsRoot): void {
    const field = this.schema.get(s.fielId)
    if (!(field instanceof TreeField)) return

    const closure = new UnderlyingClosureTable(this.tableId, field)

    this.qb.whereNotIn(
      INTERNAL_COLUMN_ID_NAME,
      this.knex
        .queryBuilder()
        .select(UnderlyingClosureTable.CLOSURE_TABLE_CHILD_ID_FIELD)
        .from(closure.name)
        .where(UnderlyingClosureTable.CLOSURE_TABLE_DEPTH_FIELD, '>', '0'),
    )
  }

  not(): this {
    this.qb = this.qb.not
    return this
  }
}
