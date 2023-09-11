import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import type { EntityProperty } from '@mikro-orm/core'
import type {
  AbstractDateRangeDateSpec,
  BoolIsFalse,
  BoolIsTrue,
  CollaboratorEqual,
  CollaboratorIsEmpty,
  CreatedByIn,
  DateBetween,
  DateEqual,
  DateGreaterThan,
  DateGreaterThanOrEqual,
  DateIsToday,
  DateLessThan,
  DateLessThanOrEqual,
  DateRangeDateEqual,
  DateRangeDateGreaterThan,
  DateRangeDateGreaterThanOrEqual,
  DateRangeDateLessThan,
  DateRangeDateLessThanOrEqual,
  DateRangeEmpty,
  DateRangeEqual,
  HasExtension,
  HasFileType,
  IRecordSpec,
  IRecordVisitor,
  IsAttachmentEmpty,
  IsTreeRoot,
  JsonEmpty,
  MultiSelectEqual,
  MultiSelectIn,
  MultiSelectIsEmpty,
  NumberEmpty,
  NumberEqual,
  NumberGreaterThan,
  NumberGreaterThanOrEqual,
  NumberLessThan,
  NumberLessThanOrEqual,
  ParentAvailableSpec,
  ReferenceEqual,
  SelectEmpty,
  SelectEqual,
  SelectIn,
  StringContain,
  StringEndsWith,
  StringEqual,
  StringRegex,
  StringStartsWith,
  TableSchemaIdMap,
  TreeAvailableSpec,
  UdpatedByIn,
  WithRecordAutoIncrement,
  WithRecordCreatedAt,
  WithRecordCreatedBy,
  WithRecordId,
  WithRecordIds,
  WithRecordLike,
  WithRecordTableId,
  WithRecordUpdatedAt,
  WithRecordUpdatedBy,
  WithRecordValues,
} from '@undb/core'
import {
  CollaboratorField,
  DateRangeField,
  FieldTypeNotSearchable,
  INTERNAL_COLUMN_CREATED_AT_NAME,
  INTERNAL_COLUMN_CREATED_BY_NAME,
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_UPDATED_AT_NAME,
  INTERNAL_COLUMN_UPDATED_BY_NAME,
  INTERNAL_INCREMENT_ID_NAME,
  MultiSelectField,
  ParentField,
  TreeField,
} from '@undb/core'
import { endOfToday, endOfTomorrow, endOfYesterday, startOfToday, startOfTomorrow, startOfYesterday } from 'date-fns'
import { castArray } from 'lodash-es'
import { Attachment } from '../../entity/attachment.js'
import type { IUnderlyingColumn } from '../../interfaces/underlying-column.js'
import { INTERNAL_COLUMN_DELETED_AT_NAME } from '../../underlying-table/constants.js'
import { UnderlyingColumnFactory } from '../../underlying-table/underlying-column.factory.js'
import { UnderlyingDateRangeFromColumn, UnderlyingDateRangeToColumn } from '../../underlying-table/underlying-column.js'
import { ClosureTable, CollaboratorForeignTable } from '../../underlying-table/underlying-foreign-table.js'
import { TABLE_ALIAS, getForeignTableAlias } from './record.constants.js'

export class RecordSqliteQueryVisitor implements IRecordVisitor {
  constructor(
    private readonly tableId: string,
    private readonly schema: TableSchemaIdMap,
    private readonly em: EntityManager,
    private qb: Knex.QueryBuilder,
    private knex: Knex,
    includeDeleted: boolean = false,
  ) {
    const alias = TABLE_ALIAS
    this.qb = qb.from(tableId + ' as ' + alias)
    if (!includeDeleted) {
      this.qb = qb.whereNull(`${alias}.${INTERNAL_COLUMN_DELETED_AT_NAME}`)
    }
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

    const column = UnderlyingColumnFactory.create(field, this.tableId) as IUnderlyingColumn
    if (column.virtual) {
      return column.name
    }
    return TABLE_ALIAS + '.' + column.name
  }

  getDateRangeDateFieldId(spec: AbstractDateRangeDateSpec) {
    const field = this.getField(spec.fieldId)
    if (!field) return TABLE_ALIAS + '.' + spec.fieldId

    if (spec.field === 'start') {
      const column = new UnderlyingDateRangeFromColumn(spec.fieldId, this.tableId)
      const fromId = TABLE_ALIAS + '.' + column.name
      return fromId
    }

    const column = new UnderlyingDateRangeToColumn(spec.fieldId, this.tableId)
    const toId = TABLE_ALIAS + '.' + column.name
    return toId
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
  createdByIn(s: CreatedByIn): void {
    this.qb.whereIn(this.getFieldId(INTERNAL_COLUMN_CREATED_BY_NAME), s.userIds)
  }
  updatedAt(s: WithRecordUpdatedAt): void {
    this.qb.where({ [this.getFieldId(INTERNAL_COLUMN_UPDATED_AT_NAME)]: s.date.value })
  }
  updatedBy(s: WithRecordUpdatedBy): void {
    this.qb.where({ [this.getFieldId(INTERNAL_COLUMN_UPDATED_BY_NAME)]: s.userId })
  }
  updatedByIn(s: UdpatedByIn): void {
    this.qb.whereIn(this.getFieldId(INTERNAL_COLUMN_UPDATED_BY_NAME), s.userIds)
  }
  autoIncrement(s: WithRecordAutoIncrement): void {
    this.qb.where(this.getFieldId(INTERNAL_INCREMENT_ID_NAME), s.n)
  }
  values(s: WithRecordValues): void {
    throw new Error('Method not implemented.')
  }
  like(s: WithRecordLike): void {
    if (s.type === 'string' || s.type === 'email' || s.type === 'number' || s.type === 'currency') {
      this.qb.andWhereLike(this.getFieldId(s.fieldId), `%${s.q}%`)
    } else {
      throw new FieldTypeNotSearchable(s.type)
    }
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
  stringEmpty(s: StringEqual): void {
    this.qb.whereNull(this.getFieldId(s.fieldId))
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
  numberEmpty(s: NumberEmpty): void {
    this.qb.whereNull(this.getFieldId(s.fieldId))
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
  jsonEmpty(s: JsonEmpty): void {
    this.qb.whereNull(this.getFieldId(s.fieldId))
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
    this.qb.whereBetween(this.getFieldId(s.fieldId), [startOfToday().toISOString(), endOfToday().toISOString()])
  }
  dateIsTomorrow(s: DateIsToday): void {
    this.qb.whereBetween(this.getFieldId(s.fieldId), [startOfTomorrow().toISOString(), endOfTomorrow().toISOString()])
  }
  dateIsYesterday(s: DateIsToday): void {
    this.qb.whereBetween(this.getFieldId(s.fieldId), [startOfYesterday().toISOString(), endOfYesterday().toISOString()])
  }
  dateRangeEqual(s: DateRangeEqual): void {
    const range = s.value.unpack()
    if (range) {
      this.qb.whereBetween(this.getFieldId(s.fieldId), range)
    } else {
      this.qb.whereNull(this.getFieldId(s.fieldId))
    }
  }
  dateRangeDateEqual(s: DateRangeDateEqual): void {
    const fieldId = this.getDateRangeDateFieldId(s)
    this.qb.where({ [fieldId]: s.value.toISOString() })
  }
  dateRangeDateGreaterThan(s: DateRangeDateGreaterThan): void {
    const fieldId = this.getDateRangeDateFieldId(s)
    this.qb.where(fieldId, '>', s.value.toISOString())
  }
  dateRangeDateLessThan(s: DateRangeDateLessThan): void {
    const fieldId = this.getDateRangeDateFieldId(s)
    this.qb.where(fieldId, '<', s.value.toISOString())
  }
  dateRangeDateGreaterThanOrEqual(s: DateRangeDateGreaterThanOrEqual): void {
    const fieldId = this.getDateRangeDateFieldId(s)
    this.qb.where(fieldId, '>=', s.value.toISOString())
  }
  dateRangeDateLessThanOrEqual(s: DateRangeDateLessThanOrEqual): void {
    const fieldId = this.getDateRangeDateFieldId(s)
    this.qb.where(fieldId, '<=', s.value.toISOString())
  }
  dateBetween(s: DateBetween): void {
    const start = s.date1
    const end = s.date2
    const field = this.getField(s.fieldId)
    if (field instanceof DateRangeField) {
      const from = new UnderlyingDateRangeFromColumn(field.id.value, this.tableId)
      const to = new UnderlyingDateRangeToColumn(field.id.value, this.tableId)
      const fromId = TABLE_ALIAS + '.' + from.name
      const toId = TABLE_ALIAS + '.' + to.name

      this.qb.where(toId, '>=', start.toISOString()).andWhere(fromId, '<=', end.toISOString())
    } else {
      this.qb.whereBetween(this.getFieldId(s.fieldId), [start.toISOString(), end.toISOString()])
    }
  }
  dateRangeEmpty(s: DateRangeEmpty): void {
    const field = this.getField(s.fieldId)
    if (field instanceof DateRangeField) {
      const from = new UnderlyingDateRangeFromColumn(field.id.value, this.tableId)
      const to = new UnderlyingDateRangeToColumn(field.id.value, this.tableId)
      const fromId = TABLE_ALIAS + '.' + from.name
      const toId = TABLE_ALIAS + '.' + to.name

      this.qb.whereNull(fromId).and.whereNull(toId)
    }
  }
  collaboratorEqual(s: CollaboratorEqual): void {
    const field = this.getField(s.fieldId)
    const value = s.value.unpack()
    if (!value?.length) return

    if (field instanceof CollaboratorField) {
      const ft = new CollaboratorForeignTable(this.tableId, field.id.value)
      const alias = getForeignTableAlias(field, this.schema)
      this.qb
        .leftJoin(
          `${ft.name} as ${alias}`,
          `${TABLE_ALIAS}.${INTERNAL_COLUMN_ID_NAME}`,
          `${alias}.${CollaboratorForeignTable.RECORD_ID}`,
        )
        .whereIn(`${alias}.${CollaboratorForeignTable.USER_ID}`, castArray(value))
    }
  }
  collaboratorIsEmpqy(s: CollaboratorIsEmpty): void {
    const field = this.getField(s.fieldId)
    if (field instanceof CollaboratorField) {
      const ft = new CollaboratorForeignTable(this.tableId, field.id.value)
      const alias = 'collaborator_is_empty_' + getForeignTableAlias(field, this.schema)
      const subQuery = this.knex
        .queryBuilder()
        .select(CollaboratorForeignTable.RECORD_ID, this.knex.raw(`COUNT(*) as xxxx_${s.fieldId}`))
        .from(ft.name)
        .groupBy(CollaboratorForeignTable.RECORD_ID)
        .as(alias)

      this.qb
        .leftOuterJoin(
          subQuery,
          `${TABLE_ALIAS}.${INTERNAL_COLUMN_ID_NAME}`,
          `${alias}.${CollaboratorForeignTable.RECORD_ID}`,
        )
        .select(`${alias}.xxxx_${s.fieldId} as xxxx_${s.fieldId}`)
        .whereNull(`${alias}.xxxx_${s.fieldId}`)
    }
  }
  multiSelectEqual(s: MultiSelectEqual): void {
    const field = this.getField(s.fieldId)
    if (field instanceof MultiSelectField) {
      const value = s.value.unpack()
      this.qb.where(this.getFieldId(s.fieldId), value ? JSON.stringify(value) : null)
    }
  }
  multiSelectIn(s: MultiSelectIn): void {
    const fieldId = this.getFieldId(s.fieldId)
    const value = s.value.unpack()
    if (value === null) return
    this.qb.fromRaw(`${this.tableId} as ${TABLE_ALIAS}, json_each(${fieldId})`).whereIn('json_each.value', value)
  }
  multiSelectIsEmpty(s: MultiSelectIsEmpty): void {
    this.qb.whereNull(this.getFieldId(s.fieldId))
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
  selectEmpty(s: SelectEmpty): void {
    this.qb.whereNull(this.getFieldId(s.fieldId))
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

    const knex = this.knex

    const meta = this.em.getMetadata().get(Attachment.name)
    const {
      tableName,
      properties: { recordId, fieldId, mimeType, extension },
    } = meta
    const alias = `has_file_type__${s.fieldId}__${tableName}`
    this.qb.leftJoin(`${tableName} as ${alias}`, function () {
      this.on(`${alias}.${recordId.fieldNames[0]}`, `${TABLE_ALIAS}.${INTERNAL_COLUMN_ID_NAME}`).andOn(
        `${alias}.${fieldId.fieldNames[0]}`,
        knex.raw('?', [s.fieldId]),
      )
    })

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

    const knex = this.knex

    const meta = this.em.getMetadata().get(Attachment.name)
    const {
      tableName,
      properties: { recordId, fieldId, extension },
    } = meta
    const alias = `has_extension__${s.fieldId}__${tableName}`
    this.qb
      .leftJoin(`${tableName} as ${alias}`, function () {
        this.on(`${alias}.${recordId.fieldNames[0]}`, `${TABLE_ALIAS}.${INTERNAL_COLUMN_ID_NAME}`).andOn(
          `${alias}.${fieldId.fieldNames[0]}`,
          knex.raw('?', [s.fieldId]),
        )
      })
      .whereIn(`${alias}.${extension.fieldNames[0]}`, castArray(value))
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

  or(left: IRecordSpec, right: IRecordSpec): this {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const visitor = this
    this.qb.where(function () {
      visitor.qb = this
      left.accept(visitor)
      visitor.qb = visitor.qb.or
      right.accept(visitor)
    })
    return this
  }

  not(): this {
    this.qb = this.qb.not
    return this
  }
}
