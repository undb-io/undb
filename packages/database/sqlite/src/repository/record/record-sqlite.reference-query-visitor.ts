/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import type {
  AttachmentField,
  CollaboratorField as CoreCollaboratorField,
  CreatedByField as CoreCreatedByField,
  Field as CoreField,
  LookupField as CoreLookupField,
  ParentField as CoreParentField,
  ReferenceField as CoreReferenceField,
  TreeField as CoreTreeField,
  UpdatedByField as CoreUpdatedByField,
  CountField,
  IFieldVisitor,
  MaxField,
  MinField,
  SumField,
  Table,
} from '@undb/core'
import {
  AbstractReferenceFieldVisitor,
  INTERNAL_COLUMN_CREATED_BY_NAME,
  INTERNAL_COLUMN_CREATED_BY_PROFILE_NAME,
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_UPDATED_BY_NAME,
  INTERNAL_COLUMN_UPDATED_BY_PROFILE_NAME,
} from '@undb/core'
import { uniqBy } from 'lodash-es'
import { Attachment } from '../../entity/attachment.js'
import type { CollaboratorField, LookupField, ParentField, ReferenceField, TreeField } from '../../entity/field.js'
import type { Table as TableEntity } from '../../entity/table.js'
import { User } from '../../entity/user.js'
import { UnderlyingColumnFactory } from '../../underlying-table/underlying-column.factory.js'
import {
  AdjacencyListTable,
  ClosureTable,
  CollaboratorForeignTable,
  getUnderlyingTableAlias,
} from '../../underlying-table/underlying-foreign-table.js'
import { TABLE_ALIAS, getForeignTableAlias } from './record.constants.js'
import { getExpandColumnName } from './record.util.js'

export class RecordSqliteReferenceQueryVisitor extends AbstractReferenceFieldVisitor implements IFieldVisitor {
  constructor(
    private readonly em: EntityManager,
    private readonly knex: Knex,
    private readonly qb: Knex.QueryBuilder,
    private readonly table: Table,
    private readonly tableEntity: TableEntity,
  ) {
    super()
  }
  #visited = new Set<string>()

  public visit(table: Table): void {
    for (const field of table.schema.fields) {
      field.accept(this)
    }
    return
  }

  #mustGetColumn(field: CoreField) {
    const fieldId = field.id.value
    const columns = this.tableEntity.fields.getItems(false)
    const column = columns.find((c) => c.id === fieldId)
    if (!column) throw new Error('missing underlying column')

    return column
  }

  #getFieldExpand(table: string, column: ReferenceField | LookupField | ParentField | TreeField) {
    return this.knex.raw(
      `json_object('${column.id}', json_object(${column.foreignDisplayFields
        .flatMap((c) => [`'${c.id}'`, `${table}.${c.id}`])
        .join(',')})) as ${getExpandColumnName(column.id)}`,
    )
  }

  attachment(field: AttachmentField): void {
    const attachmentTable = this.em.getMetadata().get(Attachment.name)
    const {
      tableName,
      properties: { recordId, fieldId, name, mimeType, id, size, token, url },
    } = attachmentTable
    const knex = this.knex

    const alias = `r__${field.id.value}__${tableName}`
    this.qb
      .select(
        this.knex.raw(`
      json_group_array(
        DISTINCT
        json_object(
          '${name.name}', ${alias}.${name.fieldNames[0]},
          '${mimeType.name}', ${alias}.${mimeType.fieldNames[0]},
          '${id.name}', ${alias}.${id.fieldNames[0]},
          '${size.name}', ${alias}.${size.fieldNames[0]},
          '${token.name}', ${alias}.${token.fieldNames[0]},
          '${url.name}', ${alias}.${url.fieldNames[0]}
        )
      )
      filter (where ${alias}.${id.fieldNames[0]} is not null)
      as ${field.id.value}
        `),
      )
      .leftJoin(`${tableName} as ${alias}`, function () {
        this.on(`${alias}.${recordId.fieldNames[0]}`, `${TABLE_ALIAS}.${INTERNAL_COLUMN_ID_NAME}`).andOn(
          `${alias}.${fieldId.fieldNames[0]}`,
          knex.raw('?', [field.id.value]),
        )
      })
      .groupBy(`${TABLE_ALIAS}.${INTERNAL_COLUMN_ID_NAME}`)
  }

  createdBy(field: CoreCreatedByField): void {
    if (this.#visited.has(field.id.value)) {
      return
    }

    const {
      properties: { id, avatar, username, color },
      tableName,
    } = this.em.getMetadata().get(User.name)

    const alias = INTERNAL_COLUMN_CREATED_BY_NAME + '_' + tableName
    this.qb
      .select(
        this.knex.raw(
          `json_object(
            '${username.fieldNames[0]}', ${alias}.${username.fieldNames[0]},
            '${avatar.fieldNames[0]}', ${alias}.${avatar.fieldNames[0]},
            '${color.fieldNames[0]}', ${alias}.${color.fieldNames[0]}
          ) as ${INTERNAL_COLUMN_CREATED_BY_PROFILE_NAME}`,
        ),
      )
      .leftJoin(
        `${tableName} as ${alias}`,
        `${alias}.${id.fieldNames[0]}`,
        `${TABLE_ALIAS}.${INTERNAL_COLUMN_CREATED_BY_NAME}`,
      )

    this.#visited.add(field.id.value)
  }

  updatedBy(field: CoreUpdatedByField): void {
    if (this.#visited.has(field.id.value)) {
      return
    }

    const {
      properties: { id, avatar, username, color },
      tableName,
    } = this.em.getMetadata().get(User.name)

    const alias = INTERNAL_COLUMN_UPDATED_BY_NAME + '_' + tableName

    this.qb
      .select(
        this.knex.raw(
          `json_object(
            '${username.fieldNames[0]}', ${alias}.${username.fieldNames[0]},
            '${avatar.fieldNames[0]}', ${alias}.${avatar.fieldNames[0]},
            '${color.fieldNames[0]}', ${alias}.${color.fieldNames[0]}
          ) as ${INTERNAL_COLUMN_UPDATED_BY_PROFILE_NAME}`,
        ),
      )
      .leftJoin(
        `${tableName} as ${alias}`,
        `${alias}.${id.fieldNames[0]}`,
        `${TABLE_ALIAS}.${INTERNAL_COLUMN_UPDATED_BY_NAME}`,
      )

    this.#visited.add(field.id.value)
  }

  collaborator(field: CoreCollaboratorField): void {
    if (this.#visited.has(field.id.value)) {
      return
    }

    const ft = new CollaboratorForeignTable(this.table.id.value, field.id.value)
    const uta = getUnderlyingTableAlias(field)
    const fta = getForeignTableAlias(field, this.table.schema.toIdMap())

    const {
      properties: { id, avatar, username, color },
      tableName,
    } = this.em.getMetadata().get(User.name)

    const subQuery = this.knex
      .queryBuilder()
      .select(
        CollaboratorForeignTable.RECORD_ID,
        CollaboratorForeignTable.USER_ID,
        this.knex.raw(`json_group_array(${CollaboratorForeignTable.USER_ID}) as ${field.id.value}`),
        this.knex.raw(`json_group_array(${fta}.${username.fieldNames[0]}) as ${username.fieldNames[0]}`),
        this.knex.raw(`json_group_array(${fta}.${avatar.fieldNames[0]}) as ${avatar.fieldNames[0]}`),
        this.knex.raw(`json_group_array(${fta}.${color.fieldNames[0]}) as ${color.fieldNames[0]}`),
      )
      .from(ft.name)
      .groupBy(CollaboratorForeignTable.RECORD_ID)
      .as(uta)

    const nestSubQuery = this.knex
      .queryBuilder()
      .select(id.fieldNames[0], avatar.fieldNames[0], username.fieldNames[0], color.fieldNames[0])
      .from(tableName)
      .groupBy(id.fieldNames[0])
      .as(fta)

    subQuery.leftJoin(nestSubQuery, `${ft.name}.${CollaboratorForeignTable.USER_ID}`, `${fta}.${id.fieldNames[0]}`)

    const column = this.#mustGetColumn(field) as CollaboratorField
    this.qb
      .select(
        `${uta}.${field.id.value} as ${field.id.value}`,
        this.knex.raw(
          `json_object('${column.id}', json_object(
            '${username.fieldNames[0]}', ${uta}.${username.fieldNames[0]},
            '${avatar.fieldNames[0]}', ${uta}.${avatar.fieldNames[0]},
            '${color.fieldNames[0]}', ${uta}.${color.fieldNames[0]}
            )
          ) as ${getExpandColumnName(column.id)}`,
        ),
      )
      .leftJoin(subQuery, `${uta}.${CollaboratorForeignTable.RECORD_ID}`, `${TABLE_ALIAS}.${INTERNAL_COLUMN_ID_NAME}`)

    this.#visited.add(field.id.value)
  }

  reference(field: CoreReferenceField): void {
    if (this.#visited.has(field.id.value)) {
      return
    }

    const column = this.#mustGetColumn(field) as ReferenceField
    const foreignTable = column.foreignTable
    if (foreignTable?.isDeleted) {
      return
    }

    const countFields = column.countFields.getItems(false).map((f) => f.toDomain())
    const sumFields = column.sumFields.getItems(false)
    const lookupFields = column.lookupFields.getItems(false)
    const averageFields = column.averageFields.getItems(false)
    const minFields = column.minFields.getItems(false)
    const maxFields = column.maxFields.getItems(false)
    const displayFields = column.foreignDisplayFields
      .concat(lookupFields.flatMap((c) => c.foreignDisplayFields))
      .concat(sumFields.map((c) => c.sumAggregateField))
      .concat(minFields.map((c) => c.minAggregateField))
      .concat(maxFields.map((c) => c.maxAggregateField))
      .concat(averageFields.map((c) => c.averageAggregateField))
    const displayColumns = uniqBy(displayFields, (f) => f.id).map((field) => field.toDomain())

    const foreignTableId = field.foreignTableId.unwrapOr(this.table.id.value)

    const adjacency = AdjacencyListTable.fromField(this.table.id.value, field)

    const foreignIdField =
      !!field.symmetricReferenceFieldId && !field.isOwner ? AdjacencyListTable.FROM_ID : AdjacencyListTable.TO_ID
    const currentIdField =
      !!field.symmetricReferenceFieldId && !field.isOwner ? AdjacencyListTable.TO_ID : AdjacencyListTable.FROM_ID

    const uta = getUnderlyingTableAlias(field)
    const fta = getForeignTableAlias(field, this.table.schema.toIdMap())
    const subQuery = this.knex
      .queryBuilder()
      .select(
        AdjacencyListTable.FROM_ID,
        AdjacencyListTable.TO_ID,
        this.knex.raw(`json_group_array(${foreignIdField}) as ${field.id.value}`),
        ...displayColumns.map((f) => this.knex.raw(`json_group_array(${fta}.${f.id.value}) as ${f.id.value}`)),
        ...countFields.map((f) => this.knex.raw(`count(*) as ${f.id.value}`)),
        ...sumFields.map((f) => this.knex.raw(`sum(${fta}.${f.sumAggregateField.id}) as ${f.id}`)),
        ...minFields.map((f) => this.knex.raw(`min(${fta}.${f.minAggregateField.id}) as ${f.id}`)),
        ...maxFields.map((f) => this.knex.raw(`max(${fta}.${f.maxAggregateField.id}) as ${f.id}`)),
        ...averageFields.map((f) => this.knex.raw(`avg(${fta}.${f.averageAggregateField.id}) as ${f.id}`)),
      )
      .from(adjacency.name)
      .groupBy(currentIdField)
      .as(uta)

    const nestSubQuery = this.knex
      .queryBuilder()
      .select(
        INTERNAL_COLUMN_ID_NAME,
        ...displayColumns
          .flatMap((f) => UnderlyingColumnFactory.create(f, foreignTableId))
          .map((c) => (c.system ? c.name + ` as ${c.fieldId}` : c.fieldId!)),
      )
      .from(foreignTableId)
      .groupBy(INTERNAL_COLUMN_ID_NAME)
      .as(fta)

    subQuery.leftJoin(nestSubQuery, `${adjacency.name}.${foreignIdField}`, `${fta}.${INTERNAL_COLUMN_ID_NAME}`)
    this.#visited.add(field.id.value)

    this.qb
      .select(
        `${uta}.${field.id.value} as ${field.id.value}`,
        this.#getFieldExpand(uta, column),
        ...lookupFields.map((c) => this.#getFieldExpand(uta, c)),
        ...[
          ...countFields,
          ...[...minFields, ...maxFields, ...sumFields, ...averageFields].map((f) => f.toDomain()),
        ].map((c) => `${uta}.${c.id.value} as ${c.id.value}`),
      )
      .leftJoin(subQuery, `${uta}.${currentIdField}`, `${TABLE_ALIAS}.${INTERNAL_COLUMN_ID_NAME}`)
  }
  tree(field: CoreTreeField): void {
    if (this.#visited.has(field.id.value)) {
      return
    }

    const { knex } = this

    const column = this.#mustGetColumn(field) as TreeField
    const countFields = column.countFields.getItems(false).map((f) => f.toDomain())
    const sumFields = column.sumFields.getItems(false)
    const minFields = column.minFields.getItems(false)
    const maxFields = column.maxFields.getItems(false)
    const averageFields = column.averageFields.getItems(false)
    const lookupFields = column.lookupFields.getItems(false)
    const displayFields = column.foreignDisplayFields
      .concat(lookupFields.flatMap((c) => c.displayFields.getItems(false)))
      .concat(sumFields.map((c) => c.sumAggregateField))
      .concat(minFields.map((c) => c.minAggregateField))
      .concat(maxFields.map((c) => c.maxAggregateField))
      .concat(averageFields.map((c) => c.averageAggregateField))
    const displayColumns = uniqBy(displayFields, (f) => f.id).map((field) => field.toDomain())

    const foreignTableId = field.foreignTableId.unwrapOr(this.table.id.value)

    const closure = new ClosureTable(this.table.id.value, field)

    const uta = getUnderlyingTableAlias(field)
    const fta = getForeignTableAlias(field, this.table.schema.toIdMap())
    const subQuery = knex
      .queryBuilder()
      .select(
        ClosureTable.PARENT_ID,
        ClosureTable.CHILD_ID,
        ClosureTable.DEPTH,
        knex.raw(`json_group_array(${ClosureTable.CHILD_ID}) as ${field.id.value}`),
        ...displayColumns.map((f) => knex.raw(`json_group_array(${fta}.${f.id.value}) as ${f.id.value}`)),
        ...countFields.map((f) => knex.raw(`count(*) as ${f.id.value}`)),
        ...minFields.map((f) => this.knex.raw(`min(${fta}.${f.minAggregateField.id}) as ${f.id}`)),
        ...maxFields.map((f) => this.knex.raw(`max(${fta}.${f.maxAggregateField.id}) as ${f.id}`)),
        ...sumFields.map((f) => this.knex.raw(`sum(${fta}.${f.sumAggregateField.id}) as ${f.id}`)),
        ...averageFields.map((f) => this.knex.raw(`avg(${fta}.${f.averageAggregateField.id}) as ${f.id}`)),
      )
      .from(closure.name)
      .where(ClosureTable.DEPTH, 1)
      .groupBy(ClosureTable.PARENT_ID)
      .as(uta)

    const nestSubQuery = knex
      .queryBuilder()
      .select(
        INTERNAL_COLUMN_ID_NAME,
        ...displayColumns
          .flatMap((f) => UnderlyingColumnFactory.create(f, foreignTableId))
          .map((c) => (c.system ? c.name + ` as ${c.fieldId}` : c.fieldId!)),
      )
      .from(foreignTableId)
      .groupBy(INTERNAL_COLUMN_ID_NAME)
      .as(fta)

    subQuery.leftJoin(nestSubQuery, `${closure.name}.${ClosureTable.CHILD_ID}`, `${fta}.${INTERNAL_COLUMN_ID_NAME}`)
    this.#visited.add(field.id.value)

    this.qb
      .select(
        `${uta}.${field.id.value} as ${field.id.value}`,
        this.#getFieldExpand(uta, column),
        ...lookupFields.map((c) => this.#getFieldExpand(uta, c)),
        ...[
          ...countFields,
          ...[...minFields, ...maxFields, ...sumFields, ...averageFields].map((f) => f.toDomain()),
        ].map((c) => `${uta}.${c.id.value} as ${c.id.value}`),
      )
      .leftJoin(subQuery, `${TABLE_ALIAS}.${INTERNAL_COLUMN_ID_NAME}`, `${uta}.${ClosureTable.PARENT_ID}`)
  }
  parent(field: CoreParentField): void {
    if (this.#visited.has(field.id.value)) {
      return
    }
    const { knex } = this
    const column = this.#mustGetColumn(field) as ParentField
    const lookupFields = column.lookupFields.getItems(false)
    const displayFields = column.foreignDisplayFields.concat(lookupFields.flatMap((f) => f.foreignDisplayFields))
    const displayColumns = uniqBy(displayFields, (f) => f.id).map((field) => field.toDomain())
    const foreignTableId = field.foreignTableId.unwrapOr(this.table.id.value)
    const closure = new ClosureTable(this.table.id.value, field)
    const uta = getUnderlyingTableAlias(field)
    const fta = getForeignTableAlias(field, this.table.schema.toIdMap())
    const subQuery = knex
      .queryBuilder()
      .select(
        ClosureTable.PARENT_ID,
        ClosureTable.CHILD_ID,
        ClosureTable.DEPTH,
        `${ClosureTable.PARENT_ID} as ${field.id.value}`,
        ...displayColumns.map((f) => knex.raw(`json_array(${fta}.${f.id.value}) as ${f.id.value}`)),
      )
      .from(closure.name)
      .where(ClosureTable.DEPTH, 1)
      .groupBy(ClosureTable.CHILD_ID)
      .as(uta)

    const nestSubQuery = knex
      .queryBuilder()
      .select(
        INTERNAL_COLUMN_ID_NAME,
        ...displayColumns
          .flatMap((f) => UnderlyingColumnFactory.create(f, foreignTableId))
          .map((c) => (c.system ? c.name + ` as ${c.fieldId}` : c.fieldId!)),
      )
      .from(foreignTableId)
      .groupBy(INTERNAL_COLUMN_ID_NAME)
      .as(fta)
    subQuery.leftJoin(nestSubQuery, `${closure.name}.${ClosureTable.PARENT_ID}`, `${fta}.${INTERNAL_COLUMN_ID_NAME}`)

    this.qb
      .select(
        `${uta}.${field.id.value} as ${field.id.value}`,
        this.#getFieldExpand(uta, column),
        ...lookupFields.map((c) => this.#getFieldExpand(uta, c)),
      )
      .leftJoin(subQuery, `${uta}.${ClosureTable.CHILD_ID}`, `${TABLE_ALIAS}.${INTERNAL_COLUMN_ID_NAME}`)

    this.#visited.add(field.id.value)
  }
  override sum(field: SumField): void {
    const reference = field.getReferenceField(this.table.schema.toIdMap())
    reference?.accept(this)
  }

  override count(field: CountField): void {
    const reference = field.getReferenceField(this.table.schema.toIdMap())
    reference?.accept(this)
  }

  override lookup(field: CoreLookupField): void {
    const reference = field.getReferenceField(this.table.schema.toIdMap())
    reference?.accept(this)
  }

  override min(field: MinField): void {
    const reference = field.getReferenceField(this.table.schema.toIdMap())
    reference?.accept(this)
  }

  override max(field: MaxField): void {
    const reference = field.getReferenceField(this.table.schema.toIdMap())
    reference?.accept(this)
  }
}
