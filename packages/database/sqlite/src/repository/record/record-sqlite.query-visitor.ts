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
  IsTreeRoot,
  NumberEqual,
  NumberGreaterThan,
  NumberGreaterThanOrEqual,
  NumberLessThan,
  NumberLessThanOrEqual,
  ParentAvailableSpec,
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
  WithRecordIds,
  WithRecordTableId,
  WithRecordUpdatedAt,
  WithRecordValues,
} from '@egodb/core'
import {
  INTERNAL_COLUMN_CREATED_AT_NAME,
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_UPDATED_AT_NAME,
  INTERNAL_INCREAMENT_ID_NAME,
  ParentField,
  TreeField,
} from '@egodb/core'
import type { Knex } from '@mikro-orm/better-sqlite'
import { endOfDay, startOfDay } from 'date-fns'
import type { IUnderlyingColumn } from '../../interfaces/underlying-column.js'
import { INTERNAL_COLUMN_DELETED_AT_NAME } from '../../underlying-table/constants.js'
import { UnderlyingColumnFactory } from '../../underlying-table/underlying-column.factory.js'
import { ClosureTable } from '../../underlying-table/underlying-foreign-table.js'
import { TABLE_ALIAS } from './record.constants.js'

export class RecordSqliteQueryVisitor implements IRecordVisitor {
  constructor(
    private readonly tableId: string,
    private readonly schema: TableSchemaIdMap,
    private qb: Knex.QueryBuilder,
    private knex: Knex,
  ) {
    const alias = TABLE_ALIAS
    this.qb = qb.from(tableId + ' as ' + alias).whereNull(`${alias}.${INTERNAL_COLUMN_DELETED_AT_NAME}`)
  }
  get query() {
    return this.qb.toQuery()
  }

  getFieldId(fieldId: string) {
    const field = this.schema.get(fieldId)
    if (!field) return TABLE_ALIAS + '.' + fieldId

    // TODO: handle date range
    const column = UnderlyingColumnFactory.create(field) as IUnderlyingColumn
    return TABLE_ALIAS + '.' + column.name
  }

  idEqual(s: WithRecordId): void {
    this.qb.where({ [this.getFieldId(INTERNAL_COLUMN_ID_NAME)]: s.id.value })
  }
  idsIn(s: WithRecordIds): void {
    this.qb.whereIn(this.getFieldId(INTERNAL_COLUMN_ID_NAME), s.idsStringList)
  }
  tableIdEqual(s: WithRecordTableId): void {
    this.qb.from(`${s.id.value} as ${TABLE_ALIAS}`)
  }
  createdAt(s: WithRecordCreatedAt): void {
    this.qb.where({ [this.getFieldId(INTERNAL_COLUMN_CREATED_AT_NAME)]: s.date.value })
  }
  updatedAt(s: WithRecordUpdatedAt): void {
    this.qb.where({ [this.getFieldId(INTERNAL_COLUMN_UPDATED_AT_NAME)]: s.date.value })
  }
  autoIncrement(s: WithRecordAutoIncrement): void {
    this.qb.where(this.getFieldId(INTERNAL_INCREAMENT_ID_NAME), s.n)
  }
  values(s: WithRecordValues): void {
    throw new Error('Method not implemented.')
  }
  stringEqual(s: StringEqual): void {
    this.qb.where({ [this.getFieldId(s.fieldId)]: s.value.unpack() })
  }
  stringContain(s: StringContain): void {
    if (s.value.unpack() === null) {
      this.qb.whereNull(this.getFieldId(s.fieldId))
    } else {
      this.qb.whereLike(this.getFieldId(s.fieldId), `%${s.value.unpack()}%`)
    }
  }
  stringStartsWith(s: StringStartsWith): void {
    if (s.value.unpack() === null) {
      this.qb.whereNull(this.getFieldId(s.fieldId))
    } else {
      this.qb.whereLike(this.getFieldId(s.fieldId), `${s.value.unpack()}%`)
    }
  }
  stringEndsWith(s: StringEndsWith): void {
    if (s.value.unpack() === null) {
      this.qb.whereNull(this.getFieldId(s.fieldId))
    } else {
      this.qb.whereLike(this.getFieldId(s.fieldId), `%${s.value.unpack()}`)
    }
  }
  stringRegex(s: StringRegex): void {
    if (s.value.unpack() === null) {
      this.qb.whereNull(this.getFieldId(s.fieldId))
    } else {
      this.qb.whereRaw(`${this.getFieldId(s.fieldId)} REGEXP ?`, [s.value.unpack()])
    }
  }
  numberEqual(s: NumberEqual): void {
    this.qb.where({ [this.getFieldId(s.fieldId)]: s.value.unpack() })
  }
  numberGreaterThan(s: NumberGreaterThan): void {
    this.qb.where(this.getFieldId(s.fieldId), '>', s.value.unpack())
  }
  numberLessThan(s: NumberLessThan): void {
    this.qb.where(this.getFieldId(s.fieldId), '<', s.value.unpack())
  }
  numberGreaterThanOrEqual(s: NumberGreaterThanOrEqual): void {
    this.qb.where(this.getFieldId(s.fieldId), '>=', s.value.unpack())
  }
  numberLessThanOrEqual(s: NumberLessThanOrEqual): void {
    this.qb.where(this.getFieldId(s.fieldId), '<=', s.value.unpack())
  }
  dateEqual(s: DateEqual): void {
    if (s.value.unpack() === null) {
      this.qb.whereNull(this.getFieldId(s.fieldId))
    } else {
      this.qb.where({ [this.getFieldId(s.fieldId)]: s.value.toString()! })
    }
  }
  dateGreaterThan(s: DateGreaterThan): void {
    if (s.value.unpack() === null) {
      this.qb.whereNull(this.getFieldId(s.fieldId))
    } else {
      this.qb.where(this.getFieldId(s.fieldId), '>', s.value.toString()!)
    }
  }
  dateLessThan(s: DateLessThan): void {
    if (s.value.unpack() === null) {
      this.qb.whereNull(this.getFieldId(s.fieldId))
    } else {
      this.qb.where(this.getFieldId(s.fieldId), '<', s.value.toString()!)
    }
  }
  dateGreaterThanOrEqual(s: DateGreaterThanOrEqual): void {
    if (s.value.unpack() === null) {
      this.qb.whereNull(this.getFieldId(s.fieldId))
    } else {
      this.qb.where(this.getFieldId(s.fieldId), '>=', s.value.toString()!)
    }
  }
  dateLessThanOrEqual(s: DateLessThanOrEqual): void {
    if (s.value.unpack() === null) {
      this.qb.whereNull(this.getFieldId(s.fieldId))
    } else {
      this.qb.where(this.getFieldId(s.fieldId), '<=', s.value.toString()!)
    }
  }
  dateIsToday(s: DateIsToday): void {
    this.qb.whereBetween(this.getFieldId(s.fieldId), [
      startOfDay(new Date()).toISOString(),
      endOfDay(new Date()).toISOString(),
    ])
  }
  dateRangeEqual(s: DateRangeEqual): void {
    const range = s.value.unpack()
    if (range) {
      this.qb.whereBetween(this.getFieldId(s.fieldId), range)
    } else {
      this.qb.whereNull(this.getFieldId(s.fieldId))
    }
  }
  selectEqual(s: SelectEqual): void {
    this.qb.where(this.getFieldId(s.fieldId), s.value.unpack())
  }
  selectIn(s: SelectIn): void {
    this.qb.whereIn(
      s.fielId,
      s.value.map((v) => v.id),
    )
  }
  boolIsTrue(s: BoolIsTrue): void {
    this.qb.where(this.getFieldId(s.fieldId), true)
  }
  boolIsFalse(s: BoolIsFalse): void {
    this.qb.where(this.getFieldId(s.fieldId), false)
  }
  referenceEqual(s: ReferenceEqual): void {
    this.qb.where(this.getFieldId(s.fieldId), s.value.unpack() ? s.value.unpack() : JSON.stringify(s.value.unpack()))
  }

  treeAvailable(s: TreeAvailableSpec): void {
    const field = this.schema.get(s.fielId)
    if (!(field instanceof TreeField)) return

    const closureTable = new ClosureTable(this.tableId, field)
    // 去掉已经有父级的 recordId
    const subQuery = this.knex
      .queryBuilder()
      .from(closureTable.name)
      .select(ClosureTable.CHILD_ID)
      .where(ClosureTable.DEPTH, '>', 0)
      .distinct()

    const recordId = s.value
    // 去掉自己父级或祖先的 recordId
    if (recordId) {
      subQuery.union(
        this.knex
          .queryBuilder()
          .from(closureTable.name)
          .select(ClosureTable.PARENT_ID)
          .where(ClosureTable.CHILD_ID, recordId)
          .andWhereNot(ClosureTable.PARENT_ID, recordId)
          .distinct(),
      )
    }

    const id = `${TABLE_ALIAS}.${INTERNAL_COLUMN_ID_NAME}`
    this.qb.whereNotIn(id, subQuery)
    if (recordId) {
      this.qb.andWhereNot(id, recordId)
    }
  }

  isTreeRoot(s: IsTreeRoot): void {
    const field = this.schema.get(s.fielId)
    if (!(field instanceof TreeField)) return

    const closure = new ClosureTable(this.tableId, field)

    const id = `${TABLE_ALIAS}.${INTERNAL_COLUMN_ID_NAME}`
    this.qb.whereNotIn(
      id,
      this.knex.queryBuilder().select(ClosureTable.CHILD_ID).from(closure.name).where(ClosureTable.DEPTH, '>', '0'),
    )
  }

  parentAvailable(s: ParentAvailableSpec): void {
    const field = this.schema.get(s.fielId)
    if (!(field instanceof ParentField)) return

    const recordId = s.value
    if (recordId) {
      const id = `${TABLE_ALIAS}.${INTERNAL_COLUMN_ID_NAME}`
      this.qb.whereNot(id, recordId)
    }
  }

  not(): this {
    this.qb = this.qb.not
    return this
  }
}
