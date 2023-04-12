import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import type { EntityProperty } from '@mikro-orm/core'
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
  HasExtension,
  HasFileType,
  IRecordVisitor,
  IsAttachmentEmpty,
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
  WithRecordCreatedBy,
  WithRecordId,
  WithRecordIds,
  WithRecordTableId,
  WithRecordUpdatedAt,
  WithRecordValues,
} from '@undb/core'
import {
  INTERNAL_COLUMN_CREATED_AT_NAME,
  INTERNAL_COLUMN_CREATED_BY_NAME,
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_UPDATED_AT_NAME,
  INTERNAL_INCREAMENT_ID_NAME,
  ParentField,
  TreeField,
} from '@undb/core'
import { endOfDay, startOfDay } from 'date-fns'
import { Attachment } from '../../entity/attachment.js'
import type { IUnderlyingColumn } from '../../interfaces/underlying-column.js'
import { INTERNAL_COLUMN_DELETED_AT_NAME } from '../../underlying-table/constants.js'
import { UnderlyingColumnFactory } from '../../underlying-table/underlying-column.factory.js'
import { ClosureTable } from '../../underlying-table/underlying-foreign-table.js'
import { TABLE_ALIAS } from './record.constants.js'

export class RecordSqliteQueryVisitor implements IRecordVisitor {
  constructor(
    private readonly tableId: string,
    private readonly schema: TableSchemaIdMap,
    private readonly em: EntityManager,
    private qb: Knex.QueryBuilder,
    private knex: Knex,
  ) {
    const alias = TABLE_ALIAS
    this.qb = qb.from(tableId + ' as ' + alias).whereNull(`${alias}.${INTERNAL_COLUMN_DELETED_AT_NAME}`)
  }
  get query() {
    return this.qb.toQuery()
  }

  getField(fieldId: string) {
    return this.schema.get(fieldId)
  }

  getFieldId(fieldId: string) {
    const field = this.getField(fieldId)
    if (!field) return TABLE_ALIAS + '.' + fieldId

    // TODO: handle date range
    const column = UnderlyingColumnFactory.create(field, this.tableId) as IUnderlyingColumn
    if (column.virtual) {
      return column.name
    }
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
  createdBy(s: WithRecordCreatedBy): void {
    this.qb.where({ [this.getFieldId(INTERNAL_COLUMN_CREATED_BY_NAME)]: s.user })
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
      s.fieldId,
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
    const field = this.schema.get(s.fieldId)
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
    const field = this.schema.get(s.fieldId)
    if (!(field instanceof TreeField)) return

    const closure = new ClosureTable(this.tableId, field)

    const id = `${TABLE_ALIAS}.${INTERNAL_COLUMN_ID_NAME}`
    this.qb.whereNotIn(
      id,
      this.knex.queryBuilder().select(ClosureTable.CHILD_ID).from(closure.name).where(ClosureTable.DEPTH, '>', '0'),
    )
  }

  parentAvailable(s: ParentAvailableSpec): void {
    const field = this.schema.get(s.fieldId)
    if (!(field instanceof ParentField)) return

    const recordId = s.value
    if (recordId) {
      const id = `${TABLE_ALIAS}.${INTERNAL_COLUMN_ID_NAME}`
      this.qb.whereNot(id, recordId)
    }
  }
  hasFileType(s: HasFileType): void {
    const value = s.value
    if (!value) return

    const meta = this.em.getMetadata().get(Attachment.name)
    const {
      tableName,
      properties: { recordId, mimeType, extension },
    } = meta
    const alias = `has_file_type__${s.fieldId}__${tableName}`
    this.qb.leftJoin(
      `${tableName} as ${alias}`,
      `${TABLE_ALIAS}.${INTERNAL_COLUMN_ID_NAME}`,
      `${alias}.${recordId.fieldNames[0]}`,
    )

    const getFieldName = (property: EntityProperty<unknown>) => `${alias}.${property.fieldNames[0]}`
    if (value === 'image' || value === 'text' || value === 'video') {
      this.qb.whereLike(getFieldName(mimeType), `${s.value}%`)
    } else if (value === 'document') {
      this.qb.whereIn(getFieldName(extension), ['.doc', '.docx'])
    } else if (value === 'excel') {
      this.qb.whereIn(getFieldName(extension), ['.xls', '.xlsx'])
    } else if (value === 'ppt') {
      this.qb.whereIn(getFieldName(extension), ['.ppt', '.pptx'])
    } else if (value === 'pdf') {
      this.qb.where(getFieldName(extension), '=', '.pdf')
    }
  }
  hasExtension(s: HasExtension): void {
    const value = s.value
    if (!value) return

    const meta = this.em.getMetadata().get(Attachment.name)
    const {
      tableName,
      properties: { recordId, extension },
    } = meta
    const alias = `has_extension__${s.fieldId}__${tableName}`
    this.qb
      .leftJoin(
        `${tableName} as ${alias}`,
        `${TABLE_ALIAS}.${INTERNAL_COLUMN_ID_NAME}`,
        `${alias}.${recordId.fieldNames[0]}`,
      )
      .where(`${alias}.${extension.fieldNames[0]}`, '=', value)
  }
  isAttachmentEmpty(s: IsAttachmentEmpty): void {
    const {
      tableName,
      properties: { recordId },
    } = this.em.getMetadata().get(Attachment.name)
    const alias = `is_attachment_empty__${s.fieldId}__${tableName}`

    const subQuery = this.knex
      .queryBuilder()
      .select(recordId.fieldNames[0], this.knex.raw(`COUNT(*) as ${s.fieldId}`))
      .from(tableName)
      .as(alias)

    this.qb
      .leftJoin(subQuery, `${TABLE_ALIAS}.${INTERNAL_COLUMN_ID_NAME}`, `${alias}.${recordId.fieldNames[0]}`)
      .select(`${alias}.${s.fieldId} as ${s.fieldId}`)
      .whereNull(s.fieldId)
  }

  not(): this {
    this.qb = this.qb.not
    return this
  }
}
